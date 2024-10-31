
edit-user = Edit User
delete-user = Delete User

username = Username {$firstName}

hello-user = Hello {$username}

# Emails count shows the number of emails in the inbox
# If there are no emails, it shows You have no emails
emails-count = You have { $emails ->
    [0] no emails
    [one] one email
   *[other] { $emails } emails
}

random = thing

open-team-cases = You have { $teamCases ->
    [0] no open cases
    [one] one open case
   *[other] { $teamCases } open cases
} across { $teams ->
    [0] no teams
    [one] one team
   *[other] {$teams}
}

gender = { $gender ->
  [m] Male
  [f] Female
 *[o] Other
}

your-gender = Your gender is { gender }

email-input = {$firstName}'s Email
  .placeholder = Enter your {$email}
  .aria-label = Email
