export default (token: string) => {
  return `<!DOCTYPE html>
<html lang="es">
<head>
	<meta charset="utf-8">
	<link rel="preconnect" href="https://fonts.gstatic.com">
	<link href="https://fonts.googleapis.com/css2?family=Poppins&display=swap" rel="stylesheet">
	<title>User confirmation</title>
</head>
<body style="background-color: #3A2160; font-family: 'Poppins', sans-serif;">
	<br><br><br>
<table style=" max-width: 600px; padding: 10px; margin:0 auto; border-collapse: collapse; border : 1px solid #333">
	<tr>
		<td style="
		background-color: #f7f7f7;
		border-radius: 12px 12px 0px 0px;
		width: 200px;"
		>
			<table width="100%">
				<tr>
					<td width="50%" style="padding : 15px">
						<img width="75px" height="25px" 
						src="cid:uniq-brand.png">
					</td>
					<td style="vertical-align: bottom;">
						<span style="font-size: 14px;">Un varietal de experiencias </span>
					</td>
				</tr>
			</table>
		</td>
	</tr>

	<tr>
		<td style="padding: 0px">
			<img style=" background-color: #f7f7f7; padding: 0; display: block; width : 600px; height: 338px" 
			src="cid:uniq-mailIlu.png"">
		</td>
	</tr>
	
	<tr>
		<td style="background-color: #f7f7f7; border-bottom-left-radius: 12px; border-bottom-right-radius: 12px; border-top-left-radius: 0;border-top-right-radius: 0;">
			<div style="color: #34495e; margin: 4% 10% 2%; text-align: center;font-family: sans-serif">
				<h2 style="color: #9663e4; margin: 0 0 7px">Thank you for register!</h2>
				<p style="margin: 2px; font-size: 15px">
					To confirm your e-mail please click the button below:</p>
					<a style="color: #8CC63F;"><br><br><br></a>
					<div style="width: 100%; text-align: center">
						<a href ="${
              process.env.NODE_ENV === "production"
                ? process.env.CORS_ORIGIN_WHITELIST_1
                : process.env.CORS_ORIGIN_WHITELIST_4
            }/verify-register/${token}" style="text-decoration: none; border-radius: 12px; padding: 11px 23px; color: white; background-color: #8CC63F" href="">Confirm my e-mail</a>	
					</div>
				<p style="color: #3A2160; font-size: 12px; text-align: center;margin: 30px 0 0">Vinplan 2021   |  <a href="#"> Privacy agreement</a></p>
			</div>
		</td>
	</tr>
</table>
</body>
</html>`;
};
