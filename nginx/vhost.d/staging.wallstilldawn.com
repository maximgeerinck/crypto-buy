location ^~ /background {
    return 301 https://api.wallstilldawn.com/background;
}