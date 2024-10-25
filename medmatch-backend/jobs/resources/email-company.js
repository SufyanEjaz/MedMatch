module.exports = {

    company_admin_content: {
        text:  `Hi {name},<br />
                Your have been added in Company {company_name} as an {role}`
    },

    export_leads_content: {
        text:  `Here you go {Name},<br />
                Your captured leads are attached to this email.<br /><br />Thank you for choosing medmatch.`
    },

    add_booth_user_content: {
        text:  `Dear {first_name},<br />
        You have been added as a {role} of the Booth {exhibitor_name} for the Event {event_name}.Please login on the below url.<br />https://vcapture.medmatch.com/.
        <br /><br />Thanks.
        `
    },

    add_booth_user_content_new: {
        text:  `<!DOCTYPE html>
        <html>
        <head>
        <title>Lead Capture</title>
        </head>
        <body>
        <div style="background:#f5f5f5;padding:5% 0;">
        <div style="background:#fff;max-width:90%;margin:0 auto;">
        <img src="https://vepimg.b8cdn.com/uploads/vjfnew//content/files/1692353320header-jpg1692353320.jpg" width="100%"/>
        <div style="padding:30px;">
        <p style="font-family: system-ui;">Hi <b>{first_name},</b></p>
        <p style="font-family: system-ui;">You have been granted booth {role} access of the Booth <b>{exhibitor_name}</b> for the Lead Capture Event <b>{event_name}.</b></p>
        <p style="font-family: system-ui;">To get started, here's what you need to do:</p>
        </div>
        <div style="background:url('https://vepimg.b8cdn.com/uploads/vjfnew//content/files/1692353320socail-bg-jpg1692353320.jpg') no-repeat;background-size:100% 100%;padding:30px 15px;">
        <p style="font-family: system-ui;text-align:center;margin-top:0px;"><b>Download the medmatch Lead Capture App from the relevant<br> app store:</b></p>
        <div style="text-align:center;">
        <div style="display: inline-block;margin:0px 5px;"><a href="https://apps.apple.com/ca/app/medmatch-lead-capture/id6450506251?platform=iphone" target="_blank"><img width="200px" src="https://vepimg.b8cdn.com/uploads/vjfnew//content/files/1692356556apple-app-store-png1692356556.png"/></a></div>
        <div style="display: inline-block;margin:0px 5px;"><a href="https://play.google.com/store/apps/details?id=com.medmatch.vcaptureApp" target="_blank"><img width="200px" src="https://vepimg.b8cdn.com/uploads/vjfnew//content/files/1692356556google-play-store-png1692356556.png"/></a></div>
        </div>
        </div>
        <div style="padding:30px;">
        <p style="font-family: system-ui;">Your login credentials are as follows:</p>
        <p style="font-family: system-ui;">Email: <b>{email_address}</b></p>
        <p style="font-family: system-ui;">Access the web version of the medmatch Lead Capture App to manage your account anytime:</p>
        <p>&nbsp; </p>
        <p style="font-family: system-ui;text-align:center;"><a style="background:#F0564D;padding: 10px 20px;font-size: 20px;color:#fff;border-radius:30px;text-decoration:none;display: inline-block;height: 40px;line-height: 2;width: 30%;" href="https://vcapture.medmatch.com/" target="_blank">Login Here</a></p>
        <p>&nbsp; </p>
        <p style="font-family: system-ui;">Best Regards,</p>
        <p style="font-family: system-ui;"><b>{event_name} Team</b></p>
        </div>
        </div>
        </div>
        </body>
        </html>
        `
    },


    sync_start_email: {
        text:  `Dear {first_name},<br />
        Your syncing for the Event {event_name} has been started. Once completed, you will be notified by email.
        <br /><br />Thanks.
        `
    },

    sync_complete_email: {
        text:  `Dear {first_name},<br />
        Your syncing for the Event {event_name} has been completed.
        <br /><br />Thanks.
        `
    },

    company_user_Content: {
        text: `<!DOCTYPE html>
        <html>
        <head>
        <title>Lead Capture</title>
        </head>
        <body>
        <div style="background:#f5f5f5;padding:5% 0;">
        <div style="background:#fff;max-width:90%;margin:0 auto;">
        <img src="https://vepimg.b8cdn.com/uploads/vjfnew//content/files/1692353320header-jpg1692353320.jpg" width="100%"/>
        <div style="padding:30px;">
        <p style="font-family: system-ui;">Dear <b>{first_name},</b></p>
        <p style="font-family: system-ui;">You have been granted company {role} access for the lead capture app of <b>{event_name}.</b></p>
        <p style="font-family: system-ui;">To get started, here's what you need to do:</p>
        <p style="font-family: system-ui;">Download the medmatch Lead Capture App from the relevant app store:</p>
        </div>
        <div style="background:url('https://vepimg.b8cdn.com/uploads/vjfnew//content/files/1692353320socail-bg-jpg1692353320.jpg') no-repeat;background-size:100% 100%;padding:30px 15px;">
        <p style="font-family: system-ui;text-align:center;margin-top:0px;"><b>Download the medmatch Lead Capture App from the relevant<br> app store:</b></p>
        <div style="text-align:center;">
        <div style="display: inline-block;margin:0px 5px;"><a href="https://apps.apple.com/ca/app/medmatch-lead-capture/id6450506251?platform=iphone" target="_blank"><img width="200px" src="https://vepimg.b8cdn.com/uploads/vjfnew//content/files/1692356556apple-app-store-png1692356556.png"/></a></div>
        <div style="display: inline-block;margin:0px 5px;"><a href="https://play.google.com/store/apps/details?id=com.medmatch.vcaptureApp" target="_blank"><img width="200px" src="https://vepimg.b8cdn.com/uploads/vjfnew//content/files/1692356556google-play-store-png1692356556.png"/></a></div>
        </div>
        </div>
        <div style="padding:30px;">
        <p style="font-family: system-ui;">Your login credentials are as follows:</p>
        <p style="font-family: system-ui;">Email: <b>{email_address}</b></p>
        <p style="font-family: system-ui;">Access the web version of the medmatch Lead Capture App to manage your account anytime:</p>
        <p>&nbsp; </p>
        <p style="font-family: system-ui;text-align:center;"><a style="background:#F0564D;padding: 10px 20px;font-size: 20px;color:#fff;border-radius:30px;text-decoration:none;display: inline-block;height: 40px;line-height: 2;width: 30%;" href="https://vcapture.medmatch.com/" target="_blank">Login Here</a></p>
        <p>&nbsp; </p>
        <p style="font-family: system-ui;">Best Regards,</p>
        <p style="font-family: system-ui;"><b>{event_name} Team</b></p>
        </div>
        </div>
        </div>
        </body>
        </html>`
    },

    medmatch_admin_Content: {
        text: `Dear vCapture team,<br>
    
        Exciting news! The company {event_name} has been successfully added to vCapture.<br>
        
        To ensure a smooth transition and provide you with the necessary information, here are the details of the company:<br>
        
        Company Name: {event_name} <br>
        
        Company Owner: {first_name} <br>
        
        Company Owner's Email Address: {owner_email} <br>
        
        Thank you for your invaluable contribution to the vCapture management team. Your efforts have played a crucial role in shaping our platform's success.<br>
        
        Together, let's redefine lead capturing and drive business growth with vCapture!<br>
         
        Best regards,<br>
        The vCapture Team.`,
    },

    medmatch_admin_Content_new: {
        text: `<!DOCTYPE html>
        <html>
        <head>
        <title>Lead Capture</title>
        </head>
        <body>
        <div style="background:#f5f5f5;padding:5% 0;">
        <div style="background:#fff;max-width:90%;margin:0 auto;">
        <img src="https://vepimg.b8cdn.com/uploads/vjfnew//content/files/1692353320header-jpg1692353320.jpg" width="100%"/>
        <div style="padding:30px;">
        <p style="font-family: system-ui;">Dear vCapture team,</p>
        <p style="font-family: system-ui;">Exciting news! The company <b>{event_name}</b> has been successfully added to vCapture.</p>
        <p style="font-family: system-ui;">To ensure a smooth transition and provide you with the necessary information, here are the details of the company:</p>
        <p style="font-family: system-ui;">Company Name: {event_name}</p>
        <p style="font-family: system-ui;">Company Owner: {first_name} </p>
        <p style="font-family: system-ui;">Company Owner's Email Address: {owner_email}  <br></p>
        
        </div>
        <div style="background:url('https://vepimg.b8cdn.com/uploads/vjfnew//content/files/1692353320socail-bg-jpg1692353320.jpg') no-repeat;background-size:100% 100%;padding:30px 15px;">
        <p style="font-family: system-ui;text-align:center;margin-top:0px;"><b>Download the medmatch Lead Capture App from the relevant<br> app store:</b></p>
        <div style="text-align:center;">
        <div style="display: inline-block;margin:0px 5px;"><a href="https://apps.apple.com/ca/app/medmatch-lead-capture/id6450506251?platform=iphone" target="_blank"><img width="200px" src="https://vepimg.b8cdn.com/uploads/vjfnew//content/files/1692356556apple-app-store-png1692356556.png"/></a></div>
        <div style="display: inline-block;margin:0px 5px;"><a href="https://play.google.com/store/apps/details?id=com.medmatch.vcaptureApp" target="_blank"><img width="200px" src="https://vepimg.b8cdn.com/uploads/vjfnew//content/files/1692356556google-play-store-png1692356556.png"/></a></div>
        </div>
        </div>
        <div style="padding:30px;">
        <p style="font-family: system-ui;">Thank you for your invaluable contribution to the vCapture management team. Your efforts have played a crucial role in shaping our platform's success.<br>
        
        Together, let's redefine lead capturing and drive business growth with vCapture.<br></p>
        <p style="font-family: system-ui;">Best Regards,</p>
        <p style="font-family: system-ui;"><b>The vCapture Team.</b></p>
        </div>
        </div>
        </div>
        </body>
        </html>`,
    },

    add_booth_user_content_eft: {
        text:  `<!DOCTYPE html>
        <html>
        <head>
        <title>Lead Capture</title>
        </head>
        <body>
        <div style="background:#f5f5f5;padding:5% 0;">
        <div style="background:#fff;max-width:90%;margin:0 auto;">
        <img src="https://vepimg.b8cdn.com/uploads/vjfnew//content/files/1692353320header-jpg1692353320.jpg" width="100%"/>
        <div style="padding:30px;">
        <p style="font-family: system-ui;">Hello <b>{first_name},</b></p>
        <p style="font-family: system-ui;">We're pleased to inform you that you've been granted booth admin access for the lead capture
        app at the  <b>{event_name}.</b></p>
        <p style="font-family: system-ui;">To begin, please follow these steps:</p>
          <ol>
            <li>Download the <b>medmatch Lead Capture App</b> from the Google or Apple store
              <div style="text-align:center;">
               <div style="display: inline-block;margin:10px 5px;"><a href="https://play.google.com/store/apps/details?id=com.medmatch.vcaptureApp" target="_blank"><img width="200px" src="https://vepimg.b8cdn.com/uploads/vjfnew//content/files/1692356556google-play-store-png1692356556.png"/></a></div>
                <div style="display: inline-block;margin:10px 5px;"><a href="https://apps.apple.com/ca/app/medmatch-lead-capture/id6450506251?platform=iphone" target="_blank"><img width="200px" src="https://vepimg.b8cdn.com/uploads/vjfnew//content/files/1692356556apple-app-store-png1692356556.png"/></a></div>
              </div>
            </li>
            <li>Log in using the following credentials:<br><br><b>Email</b>: <a href="" style="text-decoration: underline;">{email_address}</a></li>
          </ol>
        </div>
         
        
        <div style="padding:30px;">
        <p style="font-family: system-ui;">Once logged in, you will receive an additional One-Time-Passcode to gain access.</p>
          <p style="font-family: system-ui;">You can also access your account via the web version for convenient management:</p>
          <p style="font-family: system-ui;text-align:start;"><a style="background:#F0564D;padding: 10px 20px;font-size: 20px;color:#fff;border-radius:30px;text-decoration:none;display: inline-block;: 40px;line-height: 1;width: 30%;text-align:center;" href="https://vcapture.medmatch.com/" target="_blank">Login Here</a></p>
          <p style="font-family: system-ui;">Should you have any inquiries or require assistance, feel free to reach out to us.</p>
        
        
        <p>&nbsp; </p>
        <p style="font-family: system-ui;">Best Regards,</p>
        <p style="font-family: system-ui;"><b>{event_name}</b></p>
        </div>
        </div>
        </div>
        </body>
        </html>
        `
    },


};