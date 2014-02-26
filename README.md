# App Store

A marketplace for Hive apps.

![screen shot 2014-02-26 at 2 26 16 pm](https://f.cloud.github.com/assets/412533/2267157/fdcbd2e0-9eae-11e3-892a-f43c837e7469.png)

## Usage

If you want your app listed in the App store, go ahead add it to our app registry wiki page: https://github.com/hivewallet/hive-osx/wiki/App-Registry

Make sure to [tag your releases](http://git-scm.com/book/en/Git-Basics-Tagging) as [App Registry worker](https://github.com/hivewallet/app-registry) only list apps with their latest tagged git release.

## Development

### Test it in browser

    cd ~ && git clone https://github.com/hivewallet/toolbelt.git
    cd toolbelt
    open index.html

### Test it in Hive

[Download and install](http://hivewallet.com/) Hive on your Mac OSX

    cd ~ && git clone https://github.com/hivewallet/toolbelt.git
    cd ~/Library/Application\ Support/Hive/Applications/
    ln -s ~/toolbelt/ wei_lu.app_store

## Contributing

1. Fork it
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create new Pull Request
