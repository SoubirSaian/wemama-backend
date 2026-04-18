import { TEmailTemplate } from "../interface/email.interface";

const approveSessionEmailTemp = (data: any) => `
  <html>
    <head>
      <style>
        body {
          font-family: 'Verdana', 'Arial', sans-serif;        
          font-family: Arial, sans-serif;
          background-color: #f2f3f8;
          margin: 0;
          padding: 0;
        }
        .container {
          font-family: 'Verdana', 'Arial', sans-serif;        
          max-width: 600px;
          margin: 40px auto;
          background-color: #ffffff;
          padding: 40px;
          border-radius: 10px;
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
        }
        h1 {
          color: #022C22;
          font-size: 26px;
          margin-bottom: 20px;
          font-weight: bold;
          text-align: center;
        }
        p {
          color: #555555;
          line-height: 1.8;
          font-size: 16px;
          margin-bottom: 20px;
        }
        .logo {
          text-align: center;
        }
        .logo-img {
          max-width: 20%;

        }
        .code {
          text-align: center;
          background-color: #e8f0fe;
          padding: 14px 24px;
          font-size: 20px;
          font-weight: bold;
          color: #022C22;
          border-radius: 6px;
          letter-spacing: 2px;
          margin: 20px 0;
        }
        .footer {
          margin-top: 30px;
          font-size: 13px;
          color: #9e9e9e;
          text-align: center;
        }
        .footer p {
          margin: 5px 0;
        }
        a {
          color: #022C22;
          text-decoration: none;
        }
      </style>
    </head>
     
    <body>
    <div class="container">
        
        <h1>Session Approved 🎉</h1>

        <p>Hello, ${data.expertName}</p>

        <p>
        Great news! Your session has been successfully approved and is now scheduled.
        </p>

        <div style="margin: 20px 0;">
        <p><strong>Session Title:</strong> ${data.sessionTitle}</p>
        <p><strong>Date:</strong> ${data?.date}</p>
        <p><strong>Time:</strong> ${data?.time}</p>
        </div>

        <p>
        Please make sure you are ready before the scheduled time to start your live session smoothly.
        </p>

        <p>
        If you have any questions, feel free to contact our support team.
        </p>

        <br />

        <p>Best Regards,<br>Team We Mama</p>

    </div>
    </body>
  </html>
`;

export default approveSessionEmailTemp;

// /<-- <a href="https://profitablebusinessesforsale.com/"><img src="uploads/logo/pbfs-logo.png" alt="PBFS" class="logo-img"/></a> -->
