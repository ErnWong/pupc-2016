%Motion of a ball in the air 
%constants
g=9.81;%m/s^2
%parameters 
m=1;%kg
v_0=10;%m/s
angle=pi/3;%degrees
%Initial conditions
vx_0=v_0*cos(angle);
vy_0=v_0*sin(angle);
y_0=0;
x_0=0;
%Simulations parameters
t_exp=20.1;
nr_steps=100;
dt=t_exp/nr_steps;
%Setting the time vector 
t=0:dt:t_exp;
%Initializing what we want to find 
v_y=zeros(length(t));
v_x=zeros(length(t));
x=zeros(length(t));
y=zeros(length(t));


%Initial conditions 
v_y(1)=vy_0;
v_x(1:length(t))=vx_0;
y(1)=0;
x(1)=0;
%The equations 
for i=1:nr_steps
    v_y(i+1)=v_y(i)-(1/m)*g*(i-1)*(dt)^2;%this is not probably good 
    y(i+1)=y(i)+v_y(i)*dt;%this looks good
    x(i+1)=x(i)+v_x(i)*dt; %this is good 
end

%The plot
figure(1)
plot((x),(y),'m','LineWidth',3)
axis([0, 30 , 0, 30])

