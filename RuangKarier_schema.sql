-- RuangKarier database schema
-- PostgreSQL-compatible SQL

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role VARCHAR(20) NOT NULL CHECK (role IN ('student', 'counselor', 'admin')),
  name VARCHAR(150) NOT NULL,
  email VARCHAR(150),
  school VARCHAR(150),
  class_name VARCHAR(50),
  student_code VARCHAR(50),
  status VARCHAR(20) NOT NULL DEFAULT 'active',
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE consent_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  consent_checked BOOLEAN NOT NULL DEFAULT FALSE,
  confidence_score INTEGER CHECK (confidence_score BETWEEN 1 AND 10),
  main_problem TEXT,
  preparation_notes TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE screening_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  item_code VARCHAR(50) NOT NULL,
  category VARCHAR(50) NOT NULL,
  score INTEGER NOT NULL CHECK (score BETWEEN 0 AND 4),
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE riasec_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  item_no INTEGER NOT NULL CHECK (item_no BETWEEN 1 AND 30),
  dimension CHAR(1) NOT NULL CHECK (dimension IN ('R','I','A','S','E','C')),
  score INTEGER NOT NULL CHECK (score BETWEEN 1 AND 5),
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE riasec_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  r_total INTEGER NOT NULL DEFAULT 0,
  i_total INTEGER NOT NULL DEFAULT 0,
  a_total INTEGER NOT NULL DEFAULT 0,
  s_total INTEGER NOT NULL DEFAULT 0,
  e_total INTEGER NOT NULL DEFAULT 0,
  c_total INTEGER NOT NULL DEFAULT 0,
  top3_code VARCHAR(10) NOT NULL,
  summary_text TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE career_modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(150) NOT NULL,
  module_type VARCHAR(30) NOT NULL CHECK (module_type IN ('ptn','pts','ptkin','kedinasan','kerja','wirausaha')),
  riasec_tags VARCHAR(30),
  content TEXT NOT NULL,
  media_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE action_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  goal TEXT NOT NULL,
  challenge_level INTEGER CHECK (challenge_level BETWEEN 1 AND 10),
  emotion_text TEXT,
  negative_thought TEXT,
  evidence_negative TEXT,
  counter_evidence TEXT,
  alternative_view TEXT,
  new_belief TEXT,
  top_actions JSONB NOT NULL DEFAULT '[]'::jsonb,
  monthly_actions JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE evaluations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  understanding_score INTEGER CHECK (understanding_score BETWEEN 1 AND 10),
  comfort_score INTEGER CHECK (comfort_score BETWEEN 1 AND 10),
  action_score INTEGER CHECK (action_score BETWEEN 1 AND 10),
  notes TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE counseling_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  priority VARCHAR(20) NOT NULL DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  status VARCHAR(20) NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'scheduled', 'done', 'cancelled')),
  counselor_notes TEXT,
  scheduled_at TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE portfolio_exports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  pdf_url TEXT NOT NULL,
  sent_to_counselor BOOLEAN NOT NULL DEFAULT FALSE,
  sent_at TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_consent_user_id ON consent_sessions(user_id);
CREATE INDEX idx_screening_user_id ON screening_responses(user_id);
CREATE INDEX idx_riasec_user_id ON riasec_responses(user_id);
CREATE INDEX idx_riasec_results_user_id ON riasec_results(user_id);
CREATE INDEX idx_action_plans_user_id ON action_plans(user_id);
CREATE INDEX idx_evaluations_user_id ON evaluations(user_id);
CREATE INDEX idx_counseling_requests_user_id ON counseling_requests(user_id);
CREATE INDEX idx_portfolio_exports_user_id ON portfolio_exports(user_id);