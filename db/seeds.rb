# encoding: utf-8
# truncate all tables for test and development
if Rails.env != 'production'
  require 'database_cleaner'
  DatabaseCleaner.clean_with(:truncation)
end

sven = User.create!({
  :login => "svenfuchs",
  :email => "svenfuchs@artweb-design.de"
})

jose = User.create!({
  :login => "josevalim",
  :email => "jose.valim@gmail.com"
})

minimal = Repository.create!({
  :user => sven,
  :name => 'minimal',
  :url => 'https://github.com/svenfuchs/minimal',
  :last_duration => 10
})

enginex = Repository.create!({
  :user => jose,
  :name => 'enginex',
  :url => 'https://github.com/josevalim/enginex',
  :last_duration => 30
})

Build.create!({
  :repository => minimal,
  :number => 1,
  :status => 1,
  :commit => '1a738d9d6f297c105ae2',
  :message => 'add Gemfile',
  :committed_at => '2010-11-12 11:58:00',
  :committer_name => 'Sven Fuchs',
  :committer_email => 'svenfuchs@artweb-design.de',
  :started_at => '2010-11-12 12:00:00',
  :finished_at => '2010-11-12 12:00:08',
  :agent => '76f4f2ba',
  :log => 'minimal build 1 log ...'
})

Build.create!({
  :repository => minimal,
  :number => 2,
  :status => 0,
  :commit => '91d1b7b2a310131fe3f8',
  :message => 'Bump to 0.0.22',
  :committed_at => '2010-11-12 12:28:00',
  :committer_name => 'Sven Fuchs',
  :committer_email => 'svenfuchs@artweb-design.de',
  :started_at => '2010-11-12 12:30:00',
  :finished_at => '2010-11-12 12:30:08',
  :agent => 'a1732e4f',
  :log => 'minimal build 2 log ...'
})

Build.create!({
  :repository => minimal,
  :number => 3,
  :status => '',
  :commit => 'add057e66c3e1d59ef1f',
  :message => 'unignore Gemfile.lock',
  :committed_at => '2010-11-12 12:58:00',
  :committer_name => 'Sven Fuchs',
  :committer_email => 'svenfuchs@artweb-design.de',
  :started_at => '2010-11-12 13:00:00',
  :agent => '76f4f2ba',
  :log => 'minimal build 3 log ...'
})

Build.create!({
  :repository => enginex,
  :number => 1,
  :status => 1,
  :commit => '565294c05913cfc23230',
  :message => 'Update Capybara',
  :committed_at => '2010-11-11 11:58:00',
  :author_name => 'Jose Valim',
  :author_email => 'jose@email.com',
  :committer_name => 'Jose Valim',
  :committer_email => 'jose@email.com',
  :started_at => '2010-11-11 12:00:00',
  :finished_at => '2010-11-11 12:00:20',
  :agent => 'a1732e4f',
  :log => 'enginex build 1 log ...'
})
