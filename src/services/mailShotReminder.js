const dayjs = require("dayjs");
const mailService = require("../config/nodemailer");
const lodash = require("lodash");
const dbPool = require("../config/knex");
const { generateShotReminderEmail } = require("../utils/reminderShotEmail");

const emailReminderShot = async (getPollingData) => {
  try {
    const data = getPollingData();
    if (!data) return;

    let shotDataByMachine = Object.keys(data)
      .map((machineName) => {
        const shots = data[machineName].shot || [];

        // bikin lookup untuk cepat akses alarm1
        const shotMap = Object.fromEntries(shots.map((s) => [s.name, s]));

        // filter hanya shot utama yang valid
        const filteredShots = shots
          .filter((s) => !s.name.includes("alarm")) // ambil hanya shot utama
          .filter((s) => !s.name.includes("cutting")) // abaikan yang ada kata "cutting"
          .filter((s) => {
            const alarm1Name = `${s.name}_alarm1`;
            const alarm1 = shotMap[alarm1Name];

            // abaikan kalau tidak ada alarm1 atau kalau alarm1.value = 0
            if (!alarm1 || alarm1.value === 0) return false;

            // ambil hanya jika >= alarm1
            return s.value >= alarm1.value;
          })
          .map((s) => s.name);

        return {
          machine: machineName,
          shot: filteredShots,
        };
      })
      .filter((machine) => machine.shot.length > 0);

    if (!shotDataByMachine.length) return;

    // ambil data terakhir
    const lastReminderRow = await dbPool("log_email_reminder")
      .select("data")
      .where("type", "shot")
      .orderBy("created_at", "desc")
      .first();

    if (lastReminderRow) {
      let lastReminderData;
      try {
        lastReminderData = JSON.parse(lastReminderRow.data);
      } catch (err) {
        console.warn("Failed to parse lastReminderRow.data:", lastReminderRow.data);
        lastReminderData = null;
      }

      if (lastReminderData && lodash.isEqual(lastReminderData, shotDataByMachine)) {
        // console.log(`[${dayjs().format('YYYY-MM-DD HH:mm:ss')}] [SHOT REMINDER] - SKIPPED`);
        return;
      }
    }
    // generate html
    const html = generateShotReminderEmail(shotDataByMachine, {
      title: "Reminder Shot for Inventory Stock",
      bodyText: "The table below displays the shot counter data for the kanagata process section that has passed the shot count reminder.",
      footerNote:
        "This email is generated automatically by system, please do not reply",
    });

    // Ambil daftar email dari .env, support multi email (pisahkan dengan koma)
    const toEmails = (process.env.REMINDER_SHOT_EMAIL_TO)
      .split(",")
      .map(email => email.trim())
      .filter(email => !!email);
    
    console.log(toEmails)

    const mailOptions = {
      to: toEmails,
      subject: `Reminder Shot Kanagata`,
      text: `Dear PIC,
          The following Kanagata parts have reached their reminder shot limit. 
          Please review the list below and take the necessary action.`,

      html: html,
    };

    await mailService.sendEmail(mailOptions);
    console.log(`[${dayjs().format('YYYY-MM-DD HH:mm:ss')}] [SHOT REMINDER] - MAILED`);

    await dbPool("log_email_reminder").insert({
      data: JSON.stringify(shotDataByMachine),
      type: 'shot'
    });
  } catch (error) {
    console.error("emailReminderShot error:", error);
  }
};

module.exports = emailReminderShot;
