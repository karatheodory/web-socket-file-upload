# File Upload Example

With the first message it sends a file information such as original file name and size. Then it sends the file itself by chunks.

# Installation & Launch

First install Node Version Manager from [here](https://github.com/creationix/nvm).
Then, reload environment vars set in your config:

    source ~/.bashrc

Now you have `nvm` command. Use it to install Node.js version 4.2.2 or later (tested on 4.2.2 only):

    nvm install 4.2.2

Do the following command to install project dependencies:

    npm install

After that `node` command is available, and you should be able to launch the upload script with the following command:

    node upload.js --path path/to/file.here --host host --port port
