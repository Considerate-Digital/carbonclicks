# Development Setup

To set up a development environment for CarbonClicks follow the instructions below. This process has been tested on linux systems. 

### Requirements
- Docker


### Process
1. Fork the repository.
2. Create a file `.env` in the root directory.
```
touch .env
vim .env
```
3. Include the following environmental variables:
```
VITE_DB_USER=postgres
VITE_DB_PASSWORD=pick_a_password
VITE_DB_HOST=localhost
VITE_DB_PORT=5432
VITE_MAIL_USERNAME=youremail@yourdomain.com
VITE_MAIL_PASSWORD=use_your_password
VITE_MAIL_FROM_ADDRESS=youremail@yourdomain.com
VITE_MAIL_TO_ADDRESS=youremail@yourdomain.com
VITE_MAIL_FROM_NAME="Your Name"
VITE_DOMAIN_ADDRESS=http://localhost:5173
```
Note that the domain address should be `http://localhost:5173` and should not be replaced by any other address.

4. Create a file `dev.env` in the root directory.

5. Include the following environmental variables in the `dev.env` file:
```
POSTGRES_PASSWORD=pick_a_password
```
6. Run the setup shell script.
``` 
./dev_setup.sh
```
7. Open your browser and navigate to `http://localhost:5173`.

8. After your development work has been completed, please submit a pull request to have your code reviewed before being incorporated in the the main code-base.

#### Issues
If your system struggles with the setup shell script, try opening the script file and running the commands separately in a terminal.



