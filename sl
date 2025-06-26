server {
    listen 80 ;
    server_name sl.mammutepd.ir;

    root /var/www/sl;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff2?|ttf|eot)$ {
        expires 30d;
        access_log off;
    }


    l

}