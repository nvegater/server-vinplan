export default (token : string) => {
    return `<!DOCTYPE html>
<html lang="es">
<head>
	<meta charset="utf-8">
	<link rel="preconnect" href="https://fonts.gstatic.com">
    <link href="https://fonts.googleapis.com/css2?family=Poppins&display=swap" rel="stylesheet">
	<title>Forgotten password</title>
</head>
<body style="background-color: #3A2160; font-family: 'Poppins', sans-serif;">
	<br><br><br>
<table style=" max-width: 600px; padding: 10px; margin:0 auto; border-collapse: collapse; ">
	<tr>
		<td style="background-color: #f7f7f7; text-align: left; padding: 0; border-bottom-left-radius: 0; border-bottom-right-radius: 0; border-top-left-radius: 12px;border-top-right-radius: 12px;">
            <table width="100%">
                <tr>
                    <td width="50%" style="padding : 15px">
                        <img width="75px" height="25px" src="cid:uniq-brand.png">
                    </td>
                    <td style="vertical-align: bottom;">
                        <span style="font-size: 14px;">Un varietal de experiencias </span>
                    </td>
                </tr>
            </table>
        </td>
    </tr>

    <tr style=" background-color: #f7f7f7;">
		<td style="padding: 10px">
			<img style=" background-color: #f7f7f7; padding: 0; display: block; margin-left: auto;
            margin-right: auto;
            width: 50%;width : 300px; height: 338px" 
			src="cid:uniq-forgotIllu.png"">
		</td>
	</tr>

            <tr>
                <td style="background-color: #f7f7f7; border-bottom-left-radius: 12px; border-bottom-right-radius: 12px; border-top-left-radius: 0;border-top-right-radius: 0;">
                    <div style="color: #34495e; margin: 4% 10% 2%; text-align: center;font-family: sans-serif">
                        <h2 style="color: #9663e4; margin: 0 0 7px">Forgotten password?</h2>
                        <p style="margin: 2px; font-size: 18px">
                            Click the reset password button to change your passwword</p>
                            <a style="color: #8CC63F;"></a>
                            <ul style="text-align: justify;">
                                <p><b>If you don't request a password change ignore this email.</b></p>
                            </ul>
                            <br><br><br>
                            <div style="width: 100%; text-align: center">
                                <a style="text-decoration: none; border-radius: 12px; padding: 11px 23px; color: white; background-color: #8CC63F" href="${process.env.CORS_ORIGIN_WHITELIST_1}/change-password/${token}"> reset password </a>
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