-- TutorKonnect Schema

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- PROFILES (extends Supabase Auth)
-- ============================================

CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    phone_number VARCHAR(20) UNIQUE NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('student', 'tutor')),
    full_name VARCHAR(255),
    profile_photo TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- TUTOR PROFILES
-- ============================================

CREATE TABLE tutor_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
    bio TEXT,
    subjects TEXT[],
    hourly_rate DECIMAL(10,2) NOT NULL,
    qualifications TEXT,
    verification_status VARCHAR(20) DEFAULT 'pending' CHECK (
        verification_status IN (
            'pending',
            'approved',
            'rejected'
        )
    ),
    verification_rejection_reason TEXT,
    availability_notes TEXT,
    total_earned DECIMAL(10,2) DEFAULT 0,
    rating_avg DECIMAL(3,2) DEFAULT 0,
    rating_count INT DEFAULT 0,
    total_sessions INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- TUTOR DOCUMENTS
-- ============================================

CREATE TABLE tutor_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tutor_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    document_type VARCHAR(30) NOT NULL CHECK (
        document_type IN (
            'ghana_card_front',
            'ghana_card_back',
            'qualification',
            'profile_photo',
            'other'
        )
    ),
    file_url TEXT NOT NULL,
    file_name VARCHAR(255),
    file_size INT,
    mime_type VARCHAR(100),
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- VERIFICATION REQUESTS
-- ============================================

CREATE TABLE verifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tutor_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'pending' CHECK (
        status IN (
            'pending',
            'approved',
            'rejected',
            'more_info'
        )
    ),
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reviewed_at TIMESTAMP,
    reviewed_by UUID REFERENCES profiles(id),
    rejection_reason TEXT,
    admin_notes TEXT
);

-- ============================================
-- BOOKINGS
-- ============================================

CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_ref VARCHAR(20) UNIQUE,
    student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    tutor_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    subject VARCHAR(100) NOT NULL,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    duration_hours INT DEFAULT 1,
    total_amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending_payment' CHECK (
        status IN (
            'pending_payment',
            'pending_tutor_acceptance',
            'accepted',
            'confirmed',
            'rejected',
            'completed',
            'cancelled'
        )
    ),
    meet_link TEXT,
    meet_link_generated_at TIMESTAMP,
    confirmed_at TIMESTAMP,
    tutor_response_at TIMESTAMP,
    cancelled_at TIMESTAMP,
    cancellation_reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- PAYMENTS
-- ============================================

CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL,
    mobile_money_number VARCHAR(20),
    provider VARCHAR(20) CHECK (
        provider IN (
            'mtn',
            'vodafone',
            'airteltigo'
        )
    ),
    payment_status VARCHAR(20) DEFAULT 'pending' CHECK (
        payment_status IN (
            'pending',
            'processing',
            'successful',
            'failed',
            'refunded'
        )
    ),
    transaction_reference VARCHAR(255) UNIQUE,
    paystack_reference VARCHAR(255),
    paystack_access_code VARCHAR(255),
    paid_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- MESSAGES
-- ============================================

CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    receiver_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- REVIEWS
-- ============================================

CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID NOT NULL UNIQUE REFERENCES bookings(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    tutor_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- WITHDRAWALS
-- ============================================

CREATE TABLE withdrawals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tutor_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL,
    mobile_money_number VARCHAR(20) NOT NULL,
    provider VARCHAR(20) NOT NULL CHECK (
        provider IN (
            'mtn',
            'vodafone',
            'airteltigo'
        )
    ),
    status VARCHAR(20) DEFAULT 'pending' CHECK (
        status IN (
            'pending',
            'processing',
            'processed',
            'failed'
        )
    ),
    processed_at TIMESTAMP,
    processed_by UUID REFERENCES profiles(id),
    failure_reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- INDEXES
-- ============================================

-- Profiles
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_phone ON profiles(phone_number);

-- Tutor Profiles
CREATE INDEX idx_tutor_profiles_user_id ON tutor_profiles(user_id);
CREATE INDEX idx_tutor_profiles_verification_status ON tutor_profiles(verification_status);
CREATE INDEX idx_tutor_profiles_rating ON tutor_profiles(rating_avg DESC);

-- Tutor Documents
CREATE INDEX idx_tutor_documents_tutor_id ON tutor_documents(tutor_id);
CREATE INDEX idx_tutor_documents_type ON tutor_documents(document_type);

-- Verifications
CREATE INDEX idx_verifications_tutor_id ON verifications(tutor_id);
CREATE INDEX idx_verifications_status ON verifications(status);

-- Bookings
CREATE INDEX idx_bookings_student_id ON bookings(student_id);
CREATE INDEX idx_bookings_tutor_id ON bookings(tutor_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_start_time ON bookings(start_time);
CREATE INDEX idx_bookings_booking_ref ON bookings(booking_ref);

-- Payments
CREATE INDEX idx_payments_booking_id ON payments(booking_id);
CREATE INDEX idx_payments_status ON payments(payment_status);
CREATE INDEX idx_payments_transaction_reference ON payments(transaction_reference);

-- Messages
CREATE INDEX idx_messages_booking_id ON messages(booking_id);
CREATE INDEX idx_messages_sender_id ON messages(sender_id);
CREATE INDEX idx_messages_receiver_id ON messages(receiver_id);
CREATE INDEX idx_messages_created_at ON messages(created_at);

-- Reviews
CREATE INDEX idx_reviews_tutor_id ON reviews(tutor_id);
CREATE INDEX idx_reviews_booking_id ON reviews(booking_id);

-- Withdrawals
CREATE INDEX idx_withdrawals_tutor_id ON withdrawals(tutor_id);
CREATE INDEX idx_withdrawals_status ON withdrawals(status);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE tutor_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE tutor_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE withdrawals ENABLE ROW LEVEL SECURITY;

-- ============================================
-- PROFILES POLICIES
-- ============================================

CREATE POLICY "Users can view any profile"
ON profiles
FOR SELECT
USING (true);

CREATE POLICY "Users can update own profile"
ON profiles
FOR UPDATE
USING (auth.uid() = id);

-- ============================================
-- TUTOR PROFILES POLICIES
-- ============================================

CREATE POLICY "Anyone can view tutor profiles"
ON tutor_profiles
FOR SELECT
USING (true);

CREATE POLICY "Tutors can insert own profile"
ON tutor_profiles
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Tutors can update own profile"
ON tutor_profiles
FOR UPDATE
USING (auth.uid() = user_id);

-- ============================================
-- TUTOR DOCUMENTS POLICIES
-- ============================================

CREATE POLICY "Tutors can view own documents"
ON tutor_documents
FOR SELECT
USING (auth.uid() = tutor_id);

CREATE POLICY "Tutors can upload own documents"
ON tutor_documents
FOR INSERT
WITH CHECK (auth.uid() = tutor_id);

-- ============================================
-- BOOKINGS POLICIES
-- ============================================

CREATE POLICY "Users can view own bookings"
ON bookings
FOR SELECT
USING (
    auth.uid() = student_id
    OR auth.uid() = tutor_id
);

CREATE POLICY "Students can create bookings"
ON bookings
FOR INSERT
WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Tutors can update assigned bookings"
ON bookings
FOR UPDATE
USING (auth.uid() = tutor_id);

-- ============================================
-- PAYMENTS POLICIES
-- ============================================

CREATE POLICY "Users can view own payments"
ON payments
FOR SELECT
USING (
    EXISTS (
        SELECT 1
        FROM bookings
        WHERE bookings.id = payments.booking_id
        AND (
            bookings.student_id = auth.uid()
            OR bookings.tutor_id = auth.uid()
        )
    )
);

-- ============================================
-- MESSAGES POLICIES
-- ============================================

CREATE POLICY "Users can view own messages"
ON messages
FOR SELECT
USING (
    auth.uid() = sender_id
    OR auth.uid() = receiver_id
);

CREATE POLICY "Users can send messages"
ON messages
FOR INSERT
WITH CHECK (auth.uid() = sender_id);

-- ============================================
-- REVIEWS POLICIES
-- ============================================

CREATE POLICY "Anyone can view reviews"
ON reviews
FOR SELECT
USING (true);

CREATE POLICY "Students can review completed bookings"
ON reviews
FOR INSERT
WITH CHECK (
    auth.uid() = student_id
    AND EXISTS (
        SELECT 1
        FROM bookings
        WHERE bookings.id = booking_id
        AND bookings.student_id = auth.uid()
        AND bookings.status = 'completed'
    )
);

-- ============================================
-- WITHDRAWALS POLICIES
-- ============================================

CREATE POLICY "Tutors can view own withdrawals"
ON withdrawals
FOR SELECT
USING (auth.uid() = tutor_id);

CREATE POLICY "Tutors can request withdrawals"
ON withdrawals
FOR INSERT
WITH CHECK (auth.uid() = tutor_id);

-- ============================================
-- UPDATED_AT FUNCTION
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- UPDATED_AT TRIGGERS
-- ============================================

CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON profiles
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tutor_profiles_updated_at
BEFORE UPDATE ON tutor_profiles
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at
BEFORE UPDATE ON bookings
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payments_updated_at
BEFORE UPDATE ON payments
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- AUTO UPDATE TUTOR RATING
-- ============================================

CREATE OR REPLACE FUNCTION update_tutor_rating()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE tutor_profiles
    SET
        rating_avg = (
            SELECT AVG(rating)::DECIMAL(3,2)
            FROM reviews
            WHERE tutor_id = NEW.tutor_id
        ),
        rating_count = (
            SELECT COUNT(*)
            FROM reviews
            WHERE tutor_id = NEW.tutor_id
        )
    WHERE user_id = NEW.tutor_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_tutor_rating_trigger
AFTER INSERT OR UPDATE ON reviews
FOR EACH ROW
EXECUTE FUNCTION update_tutor_rating();

-- ============================================
-- AUTO UPDATE TUTOR SESSIONS
-- ============================================

CREATE OR REPLACE FUNCTION update_tutor_sessions()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'completed'
       AND OLD.status != 'completed' THEN

        UPDATE tutor_profiles
        SET total_sessions = total_sessions + 1
        WHERE user_id = NEW.tutor_id;

    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_tutor_sessions_trigger
AFTER UPDATE OF status ON bookings
FOR EACH ROW
EXECUTE FUNCTION update_tutor_sessions();

-- ============================================
-- AUTO GENERATE BOOKING REFERENCE
-- ============================================

CREATE OR REPLACE FUNCTION generate_booking_ref()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.booking_ref IS NULL THEN
        NEW.booking_ref = 'BKG-' || upper(substring(gen_random_uuid()::text, 1, 8));
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER generate_booking_ref_trigger
BEFORE INSERT ON bookings
FOR EACH ROW
EXECUTE FUNCTION generate_booking_ref();