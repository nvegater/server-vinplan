export default () => {
    return `<!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="utf-8">
        <link rel="preconnect" href="https://fonts.gstatic.com">
    <link href="https://fonts.googleapis.com/css2?family=Poppins&display=swap" rel="stylesheet">
        <title>Password change confirmation</title>
    </head>
    <body style="background-color: #3A2160; font-family: 'Poppins', sans-serif;">
        <br><br><br>
    <table style=" max-width: 600px; padding: 10px; margin:0 auto; border-collapse: collapse; ">
        <tr>
            <td style="background-color: #f7f7f7; text-align: left; padding: 0; border-bottom-left-radius: 0; border-bottom-right-radius: 0; border-top-left-radius: 12px;border-top-right-radius: 12px;">
                <a href="" style="display: inline-block;">
                    <img width="30%" style="display:block; margin: 3% 5%" src="cid:uniq-brand.png">
                </a>
                <p style="display: block; float: right; margin: 3% 5%;">Un varietal de experiencias </p>
            </td>
        </tr>
    
        <tr>
            <td style="padding: 0px">
                <img style=" background-color: #f7f7f7; padding: 0; display: block; width: 100%; height: 128px; object-fit: contain;" src="cid:lock.png">
            </td>
        </tr>
        
        <tr>
            <td style="background-color: #f7f7f7; border-bottom-left-radius: 12px; border-bottom-right-radius: 12px; border-top-left-radius: 0;border-top-right-radius: 0;">
                <div style="color: #34495e; margin: 4% 10% 2%; text-align: center;font-family: sans-serif">
                    <h2 style="color: #8CC63F; margin: 0 0 7px">Password changed</h2>
                    <p style="margin: 2px; font-size: 18px">
                        Your password  has been changed sucessfully</p>
                        <a style="color: #8CC63F;"></a>
                        <br><br>
                        <ul style="text-align: center;">
                            <p style="font-size: 12px;"><b>If you don't made this change <br> click the button below.</b></p>
                        </ul>
                        <br>
                        <div style="width: 100%; text-align: center">
                            <a style="text-decoration: none; border-radius: 12px; padding: 11px 23px; color: white; background-color: #9663e4" href="">It wasn't me</a>	
                        </div>
                        <br><br>
                    <p style="color: #3A2160; font-size: 12px; text-align: center;margin: 30px 0 0">Vinplan 2021   |  <a href=""> Privacy agreement</a></p>
                </div>
            </td>
        </tr>
    </table>
    </body>
    </html>`
}