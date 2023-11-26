const nodemailer = require('nodemailer')
require('dotenv').config()

class MailService{

      constructor(){
            this.transporter = nodemailer.createTransport({
                  host: process.env.smtp_host.trim(),
                  port: parseInt(process.env.smtp_port.trim(), 10),
                  secure: false,
                  auth:{
                        user: process.env.smtp_user,
                        pass: process.env.smtp_password,
                  }
                  
            })
      }

      async sendResetMail(to, link){
            await this.transporter.sendMail({
                  from: process.env.smtp_user.trim(),
                  to: to,
                  subject: 'Reset password on SIRIUS-SDU',
                  text: 'For reset click the link below:\n' + link,
                  html: `
                        <div>
                              <h3>For reset, click the link below:</h3>
                              <a href="${link}">${link}</a>
                        </div>
                        `,
            });
      }
}

module.exports = new MailService();