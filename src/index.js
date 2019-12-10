const jsonServer = require('json-server');
const auth = require('json-server-auth');
const jwtToken = require('jwt-decode');
const cors = require('cors');
const morgan = require('morgan');
const moment = require('moment');

const app = jsonServer.create();
const router = jsonServer.router('./src/database/db.json');
const db = require('./database/db.json');
const port = process.env.PORT || 3000;
const rules = auth.rewriter({
  bookings: 660,
  users: 640,
  freelancers: 644
});

// /!\ Bind the router db to the app
app.db = router.db;

// You must apply the auth middleware before the router
app.use(cors());
app.use(morgan('tiny'));
app.use(jsonServer.bodyParser)
app.use(rules);
app.use(auth);

app.get('/freelancers', (req, res) => {
  const { userId = undefined } = req.query;
  const { users, freelancers } = db;
  let newFreelancers;
  if (userId !== undefined) {
    newFreelancers = freelancers.filter((freelancer) => Number(userId) === Number(freelancer.userId));
  } else {
    newFreelancers = freelancers.map((freelancer) => {
      const filteredUserArr = users.filter((user) => Number(user.id) === Number(freelancer.userId));
      const [filteredUserObj] = filteredUserArr;
      const { fullName, email } = filteredUserObj;
      const mainFreelancer = {
        fullName,
        email,
        ...freelancer
      };
      return mainFreelancer
    });
  }
  res.status(200).json(newFreelancers);
});

app.get('/freelancers/:id', (req, res) => {
  const { users, freelancers } = db;
  const id = parseInt(req.params.id, 10);
  const filteredFreelanceArr = freelancers.filter((freelancer) => Number(freelancer.id) === id);
  const [filteredFreelanceObj] = filteredFreelanceArr;
  const { userId } = filteredFreelanceObj;
  const userDetailsArr = users.filter((user) => Number(user.id) === Number(userId));
  const [userDetailsObj] = userDetailsArr;
  const { fullName, email } = userDetailsObj;
  const mainUser = {
    fullName,
    email,
    ...filteredFreelanceObj
  };
  res.status(200).json(mainUser);
});
app.get('/users/:id/bookings', (req, res) => {
  const { users, bookings } = db;
  const id = parseInt(req.params.id, 10);
  const filteredBookerUserArr = bookings.filter((booking) => Number(booking.userId) === Number(id));

  const newBookers = filteredBookerUserArr.map((booker) => {
    const filteredUserArr = users.filter((user) => Number(user.id) === Number(booker.bookerId));
    const [filteredUserObj] = filteredUserArr;
    const { fullName, email } = filteredUserObj;
    const mainBooker = {
      fullName,
      email,
      ...booker
    };
    return mainBooker
  });
  res.status(200).json(newBookers);

})


app.use(router)
app.listen(port, () => {
  console.log(`Freelance Market Server Running on port ${port}`);

})