-- Users Table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(50) CHECK (role IN ('attendee', 'organizer', 'admin')),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Events Table
CREATE TABLE events (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    organizer_id UUID REFERENCES users(id),
    location VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Registrations Table
CREATE TABLE registrations (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    event_id INT REFERENCES events(id),
    status VARCHAR(50) CHECK (status IN ('registered', 'checked_in', 'cancelled')),
    registered_at TIMESTAMP DEFAULT NOW()
);
