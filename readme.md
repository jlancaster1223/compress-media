
# Installation 
First, open up terminal and cd into the ***compress-media*** directory.

Then, run the below command to install the packages
```npm install```
Once this is complete, you're ready to move onto the usage

## Installation issues
If you are still having issues with the install, try running
```npm install sharp fs-extra path```

# Usage
First, upload all your images into the input directory.  This ca be nested directories (not zip as of the current version) and the output will keep this structure.

Secondly, open up terminal and cd into the ***compress-media*** directory and run the below command
```node compress.js```

Your media will begin to compress and show in the terminal.  Once it has completed, all compressed images will be in the output directory.