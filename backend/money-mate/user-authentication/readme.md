Env to run project
``` bash
db_url=jdbc:postgresql://localhost:5432/<db_name>;db_user=<user>>;db_pass=<password>;jwt_secret=<secret> 
```

The `/auth/login/` endpoint preserves the regular email-and-password login:

```json
{
  "email": "name@example.com",
  "password": "your-password"
}
```

For the chat flow, `/auth/chat/login/` accepts only the registered phone number:

```json
{
  "phone": "11999999999"
}
```

Phone numbers are stored as text to preserve leading zeroes and must be unique. The phone-only endpoint does not verify ownership of the number; use it only where this trust model is acceptable, or add OTP verification before production use.