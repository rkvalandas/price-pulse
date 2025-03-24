# Price Pulse

## Overview
**Price Pulse** is a web application that exclusively tracks Amazon product prices. By setting a target price, users receive instant email notifications whenever the price of their desired product matches or drops below the target. Designed with user convenience in mind, this MERN stack project offers seamless functionality for bargain hunters.

---

## Key Features
- **Amazon Product Tracking**: Monitors product prices directly from Amazon.
- **Price Alerts**: Notifies users via email when the target price is met or surpassed.
- **Secure User Authentication**: Protects user accounts using JWT-based login and signup.
- **Email Notifications**: Sends real-time alerts to users' registered email addresses.
- **User Dashboard**: Enables easy management of tracked products and alerts.
- **Responsive Interface**: Optimized for desktops, tablets, and mobile devices.

---

## Live Demo
Explore the application here: [Price Pulse Live](https://prize-pulse.vercel.app/)

---

## Tech Stack
### Frontend
- **React.js**: Handles the UI/UX.
- **TailwindCSS**: Ensures sleek and modern design.
- **React Router DOM**: Manages navigation and routing.
- **Axios**: Facilitates API requests.

### Backend
- **Node.js**: Executes server-side operations.
- **Express.js**: Simplifies API development.
- **MongoDB**: Stores user, product, and alert data.
- **JWT**: Secures authentication processes.
- **Nodemailer**: Powers email notification service.
- **Cheerio**: Scrapes Amazon product prices.

---

## Installation and Setup

### Prerequisites
- Node.js (v16 or above)
- MongoDB (local or cloud instance)
- npm or yarn

### Clone the Repository
```bash
$ git clone https://github.com/rkvalandas/price_pulse
$ cd price-pulse
```

### Backend Setup
1. Navigate to the backend directory:
```bash
$ cd server
```
2. Install dependencies:
```bash
$ npm install
```
3. Create a `.env` file in the `server` directory with these variables:
```env
PORT=5000
MONGO_URI=<your_mongodb_connection_string>
JWT_SECRET=<your_jwt_secret>
EMAIL_USER=<your_email_address>
EMAIL_PASS=<your_email_password>
```
4. Start the backend server:
```bash
$ npm start
```

### Frontend Setup
1. Navigate to the frontend directory:
```bash
$ cd client
```
2. Install dependencies:
```bash
$ npm install
```
3. Start the development server:
```bash
$ npm run dev
```

---

## How to Use
1. **Sign Up**: Create a new account on the [live application](https://price-pulse-seven.vercel.app/).
2. **Log In**: Access your dashboard.
3. **Add a Product**: Paste the Amazon product URL and set your desired target price.
4. **Track Prices**: Monitor your tracked products in the dashboard.
5. **Email Alerts**: Receive notifications for price drops directly in your inbox.

---

## Contributing
Contributions are welcome! Please fork the repository and submit a pull request. For major changes, please open an issue first to discuss what you would like to change.

---

## License
This project is licensed under the MIT License.

---

## Contact
- **Email**: valandasuramakrishna@gmail.com
- **GitHub**: [rkvalandasu](https://github.com/rkvalandas)
