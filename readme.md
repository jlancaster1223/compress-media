# Media Compression on your desktop
![example of savings](https://github.com/jlancaster1223/compress-media/blob/main/5b6f3fcc-5c53-4cfc-954d-fd24105041bb.png)

## Installation 
First, open up terminal and cd into the ***compress-media*** directory.

Then, run the below command to install the packages
```npm install```
Once this is complete, you're ready to move onto the usage

## Installation issues
If you are still having issues with the install, try running
```npm install sharp fs-extra path```

# Usage

## Pre downloaded media
First, upload all your images into the input directory.  This can be nested directories (not zip as of the current version) and the output will keep this structure.

Secondly, open up terminal and cd into the ***compress-media*** directory and run the below command
```node compress.js```

## Download from url
First, create a file in the root called ```external.txt```.  In there, you can add a new url on each line and it will download it into the input folder before compressing.

Secondly, open up terminal and cd into the ***compress-media*** directory and run the below command
```node compress.js```

# Troubleshooting
## The input directory is getting over written when I try to compress the media
If you are using pre-downloaded media and when running the compress command the directory is getting overwritten, please ensure that external.txt is NOT present.  If it is, you have the compress software setup to be pulling from external media

Your media will begin to compress and show in the terminal.  Once it has completed, all compressed images will be in the output directory.
