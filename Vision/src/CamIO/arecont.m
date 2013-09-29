function p=arecont(id)
[h,port]=getsubsysaddr(sprintf('CA%d',id),'reload',false);
%url=sprintf('http://%s/image?res=half&quality=21&doublescan=0&x0=1300&x1=2900&y0=700&y1=2100',h);
url=sprintf('http://%s/image?res=half&quality=21&doublescan=0&x0=600&x1=2600&y0=500&y1=2000',h);
cmd=sprintf('curl -s ''%s'' >/tmp/im.jpg', url);
p=struct('captstart',now);
system(cmd);
p.captend=now;
p.im=imread('/tmp/im.jpg');
p.info=imfinfo('/tmp/im.jpg');
