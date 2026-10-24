const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const adminAuth = require('./middleware/adminAuth');

const Workshop = require('./models/Workshop');
const Registration = require('./models/Registration');
const app = express();

app.use(cors());
app.use(express.json());
// Admin login API
app.post('/api/admin/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (
            typeof username !== 'string' ||
            typeof password !== 'string' ||
            !username.trim() ||
            !password
        ) {
            return res.status(400).json({
                success: false,
                message: 'Username and password are required.'
            });
        }

        if (
            !process.env.ADMIN_USERNAME ||
            !process.env.ADMIN_PASSWORD_HASH ||
            !process.env.JWT_SECRET
        ) {
            console.error('Admin authentication environment variables are missing.');

            return res.status(500).json({
                success: false,
                message: 'Admin authentication is not configured.'
            });
        }

        const usernameMatches =
            username.trim() === process.env.ADMIN_USERNAME;

        const passwordMatches = await bcrypt.compare(
            password,
            process.env.ADMIN_PASSWORD_HASH
        );

        if (!usernameMatches || !passwordMatches) {
            return res.status(401).json({
                success: false,
                message: 'Invalid username or password.'
            });
        }

        const token = jwt.sign(
            {
                role: 'admin',
                username: process.env.ADMIN_USERNAME
            },
            process.env.JWT_SECRET,
            {
                expiresIn: '1h'
            }
        );

        return res.json({
            success: true,
            message: 'Admin login successful!',
            token
        });

    } catch (error) {
        console.error('Admin login error:', error);

        return res.status(500).json({
            success: false,
            message: 'Unable to log in. Please try again.'
        });
    }
});

// Test route
app.get('/', (req, res) => {
    res.send('EventEase backend is running!');
});

// API health check
app.get('/api/test', (req, res) => {
    res.json({
        success: true,
        message: 'EventEase API is working!'
    });
});

// Initial workshops to insert if the database is empty
const initialWorkshops = [
    {
        title: 'Web Development Bootcamp',
        category: 'WEB DEVELOPMENT',
        description: 'Learn modern web development and build your first website.',
        date: '28 Oct 2026',
        time: '10:00 AM',
        venue: 'Computer Science Lab',
        seats: 45,
        registered: 32,
        icon: '💻',
        color: 'purple'
    },
    {
        title: 'Introduction to Artificial Intelligence',
        category: 'AI & MACHINE LEARNING',
        description: 'Explore AI concepts and machine learning fundamentals.',
        date: '30 Oct 2026',
        time: '11:00 AM',
        venue: 'Seminar Hall',
        seats: 60,
        registered: 60,
        icon: '🤖',
        color: 'blue'
    },
    {
        title: 'Python for Beginners',
        category: 'PROGRAMMING',
        description: 'Learn Python through practical examples and exercises.',
        date: '02 Nov 2026',
        time: '09:30 AM',
        venue: 'Innovation Centre',
        seats: 40,
        registered: 18,
        icon: '🐍',
        color: 'orange'
    }
];

// Get all workshops from MongoDB
app.get('/api/events', async (req, res) => {
    try {
        const events = await Workshop.find().sort({ _id: 1 });

        res.json({
            success: true,
            events: events.map(event => ({
                ...event.toObject(),
                id: event._id.toString()
            }))
        });
    } catch (error) {
        console.error('Fetch workshops error:', error);

        res.status(500).json({
            success: false,
            message: 'Unable to fetch workshops.'
        });
    }
});
// Get all attendee registrations
app.get('/api/attendees', adminAuth, async (req, res) => {
  try {
    const registrations = await Registration.find()
      .populate('workshop', 'title date time venue')
      .sort({ createdAt: -1 });

    const attendees = registrations.map((registration) => ({
      id: registration._id.toString(),
      name: registration.name,
      email: registration.email,
      workshop: registration.workshop
        ? registration.workshop.title
        : 'Workshop unavailable',
      workshopDate: registration.workshop
        ? registration.workshop.date
        : '',
      registeredAt: registration.createdAt,
    }));

    res.json({
      success: true,
      attendees,
    });
  } catch (error) {
    console.error('Fetch attendees error:', error);

    res.status(500).json({
      success: false,
      message: 'Unable to retrieve attendees.',
    });
  }
});
// Create a new workshop
app.post('/api/events', adminAuth, async (req, res) => {
  try {
    const {
      title,
      category,
      description,
      date,
      time,
      venue,
      seats,
      icon,
      color,
    } = req.body;

    if (
      !title ||
      !category ||
      !description ||
      !date ||
      !time ||
      !venue ||
      !Number.isInteger(Number(seats)) ||
      Number(seats) < 1
    ) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all workshop details and a valid seat count.',
      });
    }

    const workshop = await Workshop.create({
      title,
      category,
      description,
      date,
      time,
      venue,
      seats: Number(seats),
      registered: 0,
      icon: icon || '📚',
      color: color || 'purple',
    });

    res.status(201).json({
      success: true,
      message: 'Workshop created successfully!',
      event: {
        ...workshop.toObject(),
        id: workshop._id.toString(),
      },
    });
  } catch (error) {
    console.error('Create workshop error:', error);

    res.status(500).json({
      success: false,
      message: 'Unable to create workshop.',
    });
  }
});

// Delete a workshop
app.delete('/api/events/:id', adminAuth, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid workshop ID.',
      });
    }

    const workshop = await Workshop.findByIdAndDelete(req.params.id);

    if (!workshop) {
      return res.status(404).json({
        success: false,
        message: 'Workshop not found.',
      });
    }

    res.json({
      success: true,
      message: 'Workshop deleted successfully!',
    });
  } catch (error) {
    console.error('Delete workshop error:', error);

    res.status(500).json({
      success: false,
      message: 'Unable to delete workshop.',
    });
  }
});
// Register for a workshop
app.post('/api/events/:id/register', async (req, res) => {
    try {
        const { name, email } = req.body;

        // Validate workshop ID
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid workshop ID.'
            });
        }

        // Validate attendee details
        if (
            typeof name !== 'string' ||
            typeof email !== 'string' ||
            !name.trim() ||
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
        ) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a valid name and email.'
            });
        }

        const workshopId = req.params.id;
        const normalizedEmail = email.trim().toLowerCase();

        // Check whether this person already registered
        const existingRegistration = await Registration.findOne({
            email: normalizedEmail,
            workshop: workshopId
        });

        if (existingRegistration) {
            return res.status(409).json({
                success: false,
                message: 'This email is already registered for this workshop.'
            });
        }

        // Reserve a seat only if seats are available
        const event = await Workshop.findOneAndUpdate(
            {
                _id: workshopId,
                $expr: { $lt: ['$registered', '$seats'] }
            },
            { $inc: { registered: 1 } },
            { new: true }
        );

        if (!event) {
            const workshopExists = await Workshop.exists({
                _id: workshopId
            });

            return res.status(workshopExists ? 400 : 404).json({
                success: false,
                message: workshopExists
                    ? 'Sorry, this workshop is fully booked.'
                    : 'Workshop not found.'
            });
        }

        try {
            // Save attendee details
            const registration = await Registration.create({
                name: name.trim(),
                email: normalizedEmail,
                workshop: workshopId
            });

            return res.status(201).json({
                success: true,
                message: `Successfully registered for ${event.title}!`,
                registration: {
                    id: registration._id,
                    name: registration.name,
                    email: registration.email,
                    workshop: workshopId,
                    registeredAt: registration.createdAt
                },
                event: {
                    ...event.toObject(),
                    id: event._id.toString()
                }
            });
        } catch (error) {
            // Roll back the count if attendee details could not be saved
            await Workshop.updateOne(
                { _id: workshopId },
                { $inc: { registered: -1 } }
            );

            if (error.code === 11000) {
                return res.status(409).json({
                    success: false,
                    message: 'This email is already registered for this workshop.'
                });
            }

            throw error;
        }
    } catch (error) {
        console.error('Registration error:', error);

        return res.status(500).json({
            success: false,
            message: 'Registration failed. Please try again.'
        });
    }
});

// Connect to MongoDB, seed initial data, and start server
async function startServer() {
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error('MONGODB_URI is missing from the .env file');
        }

        await mongoose.connect(process.env.MONGODB_URI);

        console.log('MongoDB connected successfully!');

        const workshopCount = await Workshop.countDocuments();

        if (workshopCount === 0) {
            await Workshop.insertMany(initialWorkshops);
            console.log('Initial workshops added to MongoDB!');
        } else {
            console.log(`Found ${workshopCount} existing workshops.`);
        }

        const PORT = process.env.PORT || 5001;

        app.listen(PORT, () => {
            console.log(`EventEase backend running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Startup error:', error.message);
        process.exit(1);
    }
}

startServer();
