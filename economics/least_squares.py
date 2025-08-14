no_of_obs=int(input())
x,y=[],[]
x=input().split()
y=input().split()
x=[int(i) for i in x ]
y=[int(i) for i in y ]
xy=[x[i]*y[i] for i in range(no_of_obs)]
x2=[x[i]**2 for i in range(no_of_obs)]
sx=sum(x)
sy=sum(y)
sx2=sum(x2)
sxy=sum(xy)
print("equations are")
print(sy,"=",no_of_obs,"a0+",sx,"a1")
print(sxy,"=",sx,"a0+",sx2,"a1")
