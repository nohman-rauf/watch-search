import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';

async function main() {
  console.log('\n=== Creating Admin Account ===\n');

  const supabaseUrl = 'https://semofgcoiejwhiydsrbc.supabase.co';
  const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNlbW9mZ2NvaWVqd2hpeWRzcmJjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE5NjI5MzUsImV4cCI6MjA4NzUzODkzNX0.ijxgNybk7ahvdbgiiGqEwb4H2BeWdOUbJD8LiS26poY';

  const supabase = createClient(supabaseUrl, supabaseKey);

  const email = 'nohmanrauf786@gmail.com';
  const password = 'admin321';

  const hashedPassword = await bcrypt.hash(password, 10);

  const { data, error } = await supabase
    .from('admins')
    .insert({
      email,
      password_hash: hashedPassword
    })
    .select()
    .single();

  if (error) {
    if (error.message.includes('duplicate')) {
      console.log('✓ Admin account already exists!');
      console.log(`Email: ${email}`);
      console.log('Password: admin321');
    } else {
      console.error('Error creating admin:', error.message);
      process.exit(1);
    }
  } else {
    console.log('\n✓ Admin account created successfully!');
    console.log(`Email: ${email}`);
    console.log('Password: admin321');
  }

  console.log('\nYou can now login at http://localhost:5173/login\n');
}

main();
