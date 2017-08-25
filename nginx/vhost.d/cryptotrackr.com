location ~* ^.+\.(css|js|jpg|gif|png|txt|ico|swf|xml)$ {
    expires modified +2d;
}

senfile off;
expires off;