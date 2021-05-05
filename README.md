# Setup

`client` includes all the bot-code, using tmi.js

`api` includes API code, using express

`frontend` includes a frontend, using vue.js

`.env` files contain all configs, e.g. database, bot-credentials, api tokens 

`make_secretkey.py <-hex> [N=32] [M=1]` creates `[M]` random character strings of length `[N]` including numbers, letters, uppercase letters and special characters(`<>^#()[]*%&=-_`). Using `-hex` will return only hex characters

E.g. 
```
python ./make_secretkey.py 64 3
Key 1: 0>8jMcfKQPh2ardB2Yt75>BGzhOY]xo3-QXC-Wzr8M3FKvJklsLyDJjq%2YJS^IB
Key 2: bH*)az6*Pv&K(>]^5YyVOmENs#xM0eONSd^24VXh7UNO7Ei0-Ta8VGe5olCgw_[D
Key 3: R#g)*^<GI_E&bZ<Oe_4&sv)aFepPJBPC5O]z8y(2ZU)jHskjpRZ%XxPs-ZYNX7(j
```

# Running it

Before running this project, make sure to generate your own certificate files or use existing ones, e.g. from LetsEncrypt.

To generate certificates, run 

> openssl req -x509 -newkey rsa:4096 -keyout api/crypto/key.pem -out api/crypto/cert.pem -days 365

Use `docker-compose up` to start the project. A local folder called `logs` will be created to record all logs.

# Todo

- [x] Database
- [ ] Frontend-Adminpanel
- [ ] User System
- [ ] DB-Caching
- [x] Modules for functions
- [ ] First Customer
