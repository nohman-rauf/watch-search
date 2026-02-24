import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';
import * as readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query: string): Promise<string> {
  return new Promise(resolve => rl.question(query, resolve));
}

async function main() {
  console.log('\n=== Create Admin Account ===\n');

  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error('Error: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY must be set in .env file');
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  const email = await question('Enter admin email: ');
  const password = await question('Enter admin password: ');

  if (!email || !password) {
    console.error('Error: Email and password are required');
    rl.close();
    process.exit(1);
  }

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
    console.error('Error creating admin:', error.message);
    rl.close();
    process.exit(1);
  }

  console.log('\n✓ Admin account created successfully!');
  console.log(`Email: ${email}`);
  console.log('\nYou can now login at http://localhost:5173/login\n');

  rl.close();
}

main();
