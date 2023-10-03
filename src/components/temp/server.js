// app.post("/schedule/create", (req, res) => {
// 	const { userId, timezone, schedule } = req.body;
// 	console.log(req.body);
// });

export async function handleCreateSchedule(
	selectedTimezone,
	schedule,
	navigate
) {
	try {
		await fetch("http://localhost:3000/schedule/create", {
			method: "POST",
			body: JSON.stringify({
				userId: localStorage.getItem("_id"),
				timezone: selectedTimezone,
				schedule,
			}),
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
			},
		});
		//👇🏻 navigates to the profile page
		navigate(`/profile/${localStorage.getItem("_id")}`);
	} catch (err) {
		console.error(err);
	}
}
