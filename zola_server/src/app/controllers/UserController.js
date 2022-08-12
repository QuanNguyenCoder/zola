const User = require('../model/User');

class UserController {
	async getInformationUser(req, res, next) {
		let user = await User.findOne({ phone: req.query.phone });

		if (user) {
			user = user.toObject();
			delete user.password;
			delete user.friends;
			return res.json({ infor: user, status: true });
		} else {
			return res.json({ msg: 'Người dùng không tồn tại', status: false });
		}
	}
	async updateInformationUser(req, res, next) {
		let updatedValues = req.body;
		console.log(updatedValues);
		await User.updateOne({ _id: req.body._id }, { ...req.body });

		return res.json({ msg: 'Updating successfully!', status: true });
	}
	async uploadAvatar(req, res, next) {
		if (req.file) {
			let url = process.env.HOST + req.file.path.substr(10);
			return res.json({
				msg: 'Uploading image is added successfully!',
				status: true,
				url: url,
			});
		} else {
			return res.json({
				status: false,
				msg: 'No file updated!!!',
			});
		}
	}
	async getFriends(req, res, next) {
		try {
			const friends = [];
			let user = await User.findOne({ phone: req.query.phone });
			user = user.toObject();
			delete user.password;

			for (let i = 0; i < user.friends.length; i++) {
				let tempUser = await User.findOne({ phone: user.friends[i] });
				tempUser = tempUser.toObject();
				delete tempUser.password;
				delete tempUser.friends;

				friends.push(tempUser);
			}

			delete user.password;
			return res.json({ friends: friends, status: true });
		} catch (error) {
			next(error);
		}
	}
}

module.exports = new UserController();
