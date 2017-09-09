
clear
%The whole code is laid out to help you with the creation of your own code.
% You can use it and modify it 
% as you wish and it exists in oder to help you develop your simulation 

%We work in international system except for E_e which is in electronvolts 

%Physical constants to be used 
c=3*10^8; % [m/s]
m_e=9.1*10^-31; % [kg]
eps=8.85*10^-12; % [F/m]
e=1.6*10^-19; % [C] 

% Parameters 
t_exp=16.5*10^-12; % [s] Time of observing the phenomena 
t_p=15*10^-12; % [s] Time that shows how long is the pump pulse 
t_s=500*10^-15;% [s] Time that shows how long is the seed pulse 
n_e=1.1*10^25;% electrons per m^3
E_e=8; % this is in eV. Transform it into joules when calculating v_thm  
lambda_p=351*10^-9;% [m] 
lambda_s=400*10^-9;% [m]
length_plasma=0.004;% [m]  
length_non_plasma=0.001;% [m]
Diam_spot=150*10^-6;% [m] 
window_length=length_plasma+length_non_plasma;

%Pump characteristics
E_pump=0.5;% [J] Measured in Joules
area_pump=
I_a1=
a1_0=
w1=

%Seed Characteristics 
E_seed=.0000700001;% [J] 70*10^-6 Joules 
area_seed= % [m^2]
I_a2=   
a2_0=
w2=

%Langmuir wave characteristics 
k_3= %
v_thm= % thermal velocity
w_pl= % cold plasma oscillation frequency 
w3= % Langmuir wave 

%Nr of steps , condition for distance, time, think about your variables, 
%time and space, and how do you wish to work with them   
nr_steps=1500;
dx=
dt=dx/c;%Maybe leave this step here for simplicity 
x=
t=
plasma_end=round(length_plasma/dx); 

%Other parameters
K=(sqrt(w1*w_pl))/2; 

%Initializing parameters;
%Think about why do you need them to be in this form
a1=zeros(length(t),length(x));
a2=zeros(length(t),length(x));
a3=zeros(length(t),length(x));

%Initial conditions for a1 such that the two waves begin to interract at the
%interface between plasma and vacuum (or in a place of your choice, preferrably in the plasma)

%......


%Initial conditions for the seed pulse

%.........

%Three wave-equation 

%Think about using "for" loops to model each step in dt and each step in dx

%{
.....................
%Write the code that models the 3 main equations here, and think about
separating (if neccessary) the interaction where plasma is present and the 
interaction where there is no plasma, and write the apropriate equations
 for a1,a2,a3 in both cases.  


%After that try to code the fact that the pump comes from the left 
     and the pulse has a certain duration. 


% Also try to write that the seed pulse comes from the right and
 has a certain duration. 

 As a general idea for the 3 wave equation think about,
 how would you code that a wave comes from the right 
 and goes to the left with speed c?. Remember that the given 3 equations
 for the 3 wave interaction should contain that movement in them, as they
 are derived from Maxwell's equations. 

%}

%When you want to see the maximum a2 you can use the following code
%Modelating maximums 
max_t=zeros(1,length(t));
for i=1:length(t)
    
    max_t(1,i)=max(abs(a2(i,:)));
    
end
a1_0
a2_max=max(max_t)

% What follows from here are some plotting functions that are designed to help you
% with the plotting. If you have any other ideas of how you wish your plot
% to look like, you can choose any code you like. They are only for help if
% you need it and you can modify it according to your needs.
figure(1)
%Making of a plot 
plot_vector=1:10:length(t); % Selects the times from 10 to 10 dt's plot_vector=[0,10,20,30,....]
for i=1:length(plot_vector)
    plot(x,abs(a1(plot_vector(i),:)),'m','LineWidth',3)%Makes a plot of a1(t,x) with respect to the x axis, at
    %each i*dt selected from the "plot_vector" vector
    %The command "Linewidth,3" defines the thickness of the line, and "m" defines the colour, in this case, magenta  
    hold on %This command keeps all the following plots together on one graph 
    plot(x,abs(a2(plot_vector(i),:)),'r','LineWidth',3)
    plot(x,abs(a3(plot_vector(i),:)),'b','LineWidth',3)
    line([.004,.004],[0,11*a1_0],'Color','c','LineStyle','--')%This line marks the interface vaccum-plasma
    axis([0, window_length, 0, 11*a1_0]);%This is a function which delimits the "x" axis in the left side with 0 and in 
    %the right side with "window_length", the "y" axis is has 0 as a left
    %limit, and 11*a1_0 as a right limit. Feel free to play with these
    %limits as you wish in order to help you obtain a working simulation 
    
    %Text decribing the two boundaries 
    text(.0033,7*a1_0,'Plasma')
    text(.0042,7*a1_0,'Vacuum')
    
    %Text describing the 3 waves 
    text(0.0002,10.5*a1_0,'Pump','Color','magenta','FontSize',12)
    text(0.0002,10*a1_0,'Seed','Color','red','FontSize',12)
    text(0.0002,9.5*a1_0,'Langmuir','Color','blue','FontSize',12)
    %
    
    
    
    mov(i)=getframe;%this command makes the whole plot behave like a movie
    hold off%this command stops kepping subsequent plots on the same graph 
end

%The next part of the code is making snapshots of the results 

%Times at which one makes snapshots
t_snap1=(t_p*(1/4))/dt;
t_snap2=(t_p*(2/4))/dt;
t_snap3=(t_p*(3/4))/dt;
t_snap4=(t_p*(4/4))/dt;

figure(2)%Here we make some snapshots 

%First plot at t_snap1

subplot(4,1,1)
plot(x,abs(a1(t_snap1,:)),'m','LineWidth',3)
hold on
plot(x,abs(a2(t_snap1,:)),'r','LineWidth',3)
plot(x,abs(a3(t_snap1,:)),'b','LineWidth',3)
line([.004,.004],[0,11*a1_0],'Color','k','LineStyle','--')
text(.0033,6*a1_0,'3.75 ps')
hold off
axis([0 window_length 0 7*a1_0]);  

%Second plot at t_snap2
subplot(4,1,2)
plot(x,abs(a1(t_snap2,:)),'m','LineWidth',3)
hold on
plot(x,abs(a2(t_snap2,:)),'r','LineWidth',3)
plot(x,abs(a3(t_snap2,:)),'b','LineWidth',3)
line([.004,.004],[0,11*a1_0],'Color','k','LineStyle','--')
text(.0033,6*a1_0,'7.5 ps')
hold off
axis([0 window_length 0 7*a1_0]); 

%Third plot at t_snap3
subplot(4,1,3)
plot(x,abs(a1(t_snap3,:)),'m','LineWidth',3)
hold on
plot(x,abs(a2(t_snap3,:)),'r','LineWidth',3)
plot(x,abs(a3(t_snap3,:)),'b','LineWidth',3)
line([.004,.004],[0,11*a1_0],'Color','k','LineStyle','--')
text(.0033,6*a1_0,'11.25 ps')
hold off
axis([0 window_length 0 7*a1_0]); 

%Fourth plot at t_snap4 
subplot(4,1,4)
plot(x,abs(a1(t_snap4,:)),'m','Linewidth',3)
hold on
plot(x,abs(a2(t_snap4,:)),'r','Linewidth',3)
plot(x,abs(a3(t_snap4,:)),'b','Linewidth',3)
line([.004,.004],[0,11*a1_0],'Color','k','LineStyle','--')
text(.0033,6*a1_0,'15 ps')
hold off
axis([0 window_length 0 8*a1_0])

%Here is the legend that sets the axes 
legend('Pump','Seed','Langmuir Wave')
xlabel('z');
ylabel('a1,a2,a3');



