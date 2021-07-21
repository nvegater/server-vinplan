import {format} from "date-fns";

export interface BookedServiceData {
	cost: number;
	eventType: string;
	wineryName: string;
	startDateTime: Date;
	recommendedEventType?: string;
	recommendedWineryName?: string;
	recommendedWineryId?: string;
	recommendedWineryImage?: string;
}
export default (registerData : BookedServiceData) => {
    return `<!DOCTYPE html>
	<html lang="es">
	<head>
		<meta charset="utf-8">
		<link rel="preconnect" href="https://fonts.gstatic.com">
	<link href="https://fonts.googleapis.com/css2?family=Poppins&display=swap" rel="stylesheet">
		<title>Book confirtmation</title>
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
				<img style=" background-color: #f7f7f7; padding: 0; display: block; width: 100%; height: 128px; object-fit: contain;" src="cid:uniq-checkllu.png">
			</td>
		</tr>
		<tr>
			<td style="background-color: #f7f7f7; border-bottom-left-radius: 12px; border-bottom-right-radius: 12px; border-top-left-radius: 0;border-top-right-radius: 0;">
				<div style="color: #34495e; margin: 4% 10% 2%; text-align: center;font-family: sans-serif">
					<h2 style="color: #9663e4; margin: 0 0 7px">Book Confirmed!</h2>
					<p style="margin: 2px; font-size: 24px">
						Booked service with $${registerData.cost}:</p>
						<a style="color: #8CC63F;"></a>
						<ul style="text-align: justify;">
							<li>${registerData.eventType} en ${registerData.wineryName} - ${format(registerData.startDateTime, "KK mm aaa cccc d MMMM RRRR")}</li>
						</ul>
						<br><br><br>
						<div style="width: 100%; text-align: center">
							<a style="text-decoration: none; border-radius: 12px; padding: 11px 23px; color: white; background-color: #8CC63F; cursor: pointer;" 
							href="${process.env.NODE_ENV === 'production' ? process.env.CORS_ORIGIN_WHITELIST_1 : process.env.CORS_ORIGIN_WHITELIST_4}/user-profile">View booking</a>	
						</div>
						<!--
						<div>
							<br>
							<br>
							<br>
							<h4>You might also be interested</h4>
							<div id="recomendation" style="display: inline-block; border: solid 2px #9663e4; border-radius: 12px; width: 40%;">
								<img src="${registerData.recommendedWineryImage}" width="100%" style="border-radius: 11px;"/>
								<p><b>${registerData.recommendedEventType} en ${registerData.recommendedWineryName}</b></p>
								<a style="text-decoration: none; border-radius: 12px; padding: 12px 12px; color: white; background-color: #8CC63F; cursor: pointer;" 
								href="${process.env.NODE_ENV === 'production' ? process.env.CORS_ORIGIN_WHITELIST_1 : process.env.CORS_ORIGIN_WHITELIST_4}/winery/${registerData.recommendedWineryId}">
								Check service</a>
							</div>
						</div>
						-->
						<br><br>
					<p style="color: #3A2160; font-size: 12px; text-align: center;margin: 30px 0 0">Vinplan 2021   |  <a href=""> Privacy agreement</a></p>
				</div>
			</td>
		</tr>
	</table>
	</body>
	</html>`
}