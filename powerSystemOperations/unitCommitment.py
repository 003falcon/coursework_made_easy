import time

# # Function to measure execution time
# def measure_execution_time():
#     # Wait for user input
#     input("Press Enter to start the timer: ")
    
#     # Record the start time after user input
    
    
#     # Your code goes here
#     # Example: a simple loop
#     for i in range(1000000):
#         pass
    
#     # Record the end time after code execution
#     end_time = time.time()
    
#     # Calculate the execution time
    

# # Call the function
# measure_execution_time()
def fn(i,Pgi):
  # i - the ith generating unit
  # Pgi -the power demand
  f[i][Pgi] = 0.5*a[i]*(Pgi**2) + b[i]*Pgi
  # return f[i][Pgi]

n=int(input("Enter the number of generating units"))
start_time = time.time()
mini=[0]*(n+1)
maxi=[0]*(n+1)
a=[0]*(n+1)
b=[0]*(n+1)
for i in range(1,n+1):
  print("""Enter minimum capacity (in MW) ,
           maximum capacity (in MW) ,
           coefficient a in (Rs/MW-hr^2) ,
           coefficient b in (Rs/MW-hr) of generator """,i)
  [mini[i],maxi[i],a[i], b[i]]=[float(val) for val in input().split()]
 
load=int(input("Enter the load (in MW)"))
#load changes to be made in steps of 1 MW

#F[i][j] is the minimum cost in Rs/hr in generating j (MW) watt by i generating units
F=[[float('inf') for _ in range(load+1) ] for _ in range(n+1)]
#f[i][j] is the cost of generating j (MW) by the ith generating unit
f=[[ 0 for _ in range(load+1) ] for _ in range(n+1)]

for i in range(n+1):
  for j in range(load+1):
    fn(i,j)
    if i==1:
      F[i][j]=f[i][j]

#initially setting F and f equal for 1st unit
# F[1][load]=f[1][load]
print(F[1][load])
print(f[2][2]+f[1][7])

for unit in range(2,n+1):
  for l in range(load+1):
    F[unit][load]=min(F[unit][load],f[unit][l]+F[unit-1][load-l])
  
print(F[3][load])
print(F[4][load])

end_time = time.time()
execution_time = end_time - start_time
print(f"Execution time: {execution_time} seconds")



  
  
  