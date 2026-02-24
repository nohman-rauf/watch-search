import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';

async function main() {
  const supabaseUrl = 'https://semofgcoiejwhiydsrbc.supabase.co';
  const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNlbW9mZ2NvaWVqd2hpeWRzcmJjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE5NjI5MzUsImV4cCI6MjA4NzUzODkzNX0.ijxgNybk7ahvdbgiiGqEwb4H2BeWdOUbJD8LiS26poY';

  const supabase = createClient(supabaseUrl, supabaseKey);

  const email = 'nohmanrauf786@gmail.com';
  const password = 'admin321';

  console.log('Testing login for:', email);

  const { data: admin, error } = await supabase
    .from('admins')
    .select('*')
    .eq('email', email)
    .maybeSingle();

  if (error) {
    console.error('Error fetching admin:', error);
    return;
  }

  if (!admin) {
    console.error('Admin not found');
    return;
  }

  console.log('Admin found:', {
    id: admin.id,
    email: admin.email,
    created_at: admin.created_at
  });

  const isValid = await bcrypt.compare(password, admin.password_hash);
  console.log('Password valid:', isValid);

  if (isValid) {
    console.log('✓ Login credentials are correct!');
  } else {
    console.log('✗ Password does not match!');
  }
}

main();
