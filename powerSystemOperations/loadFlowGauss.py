import sys
from loadFlowGaussSeidel import buildYbus
sys.stdin = open('./powerSystemOperations/input.txt', 'r')

#Main code
iterations=3
# print("Enter number of buses")
n=int(input())

Y=buildYbus(n)

V=[[complex(0,0) for _ in range(n)] for _ in range(iterations+1)]
P=[complex(0,0) for _ in range(n)]
Q=[complex(0,0) for _ in range(n)]

for i in range(n):
  # print(f"Enter bus voltage at generator {i+1} spacing the real and imaginary parts ")
  busVoltage=[float(val) for val in input().split()]
  V[0][i]=complex(busVoltage[0],busVoltage[1])

  # print(f"Enter net active power P at generator {i+1} spacing the real and imaginary parts ")
  p=[float(val) for val in input().split()]
  P[i]=complex(p[0],p[1])
  
  # print(f"Enter net reactive power Q at generator {i+1} spacing the real and imaginary parts ")
  q=[float(val) for val in input().split()]
  Q[i]=complex(q[0],q[1])
  
for i in range(1,iterations+1):
  V[i][0]=V[i-1][0]
  
print("voltage  matrix")
for row in V:
  print(row)
  
print("P  matrix")
for row in P:
  print(row)

print(" Q  matrix")
for row in Q:
  print(row)

A = [(-1j * Q[i] + P[i]) / Y[i][i] for i in range(n)]
B = [[complex(0, 0) if i == j else Y[i][j] / Y[i][i] for j in range(n)] for i in range(n)]


print(" A  matrix")
for row in A:
  print(row)  

currIterations=1
while currIterations<=iterations:
  # Skip slack bus (bus 0)
  busCnt=1
  while busCnt<n:
    
    V[currIterations][busCnt]=A[busCnt]/(V[currIterations-1][busCnt].conjugate())
    print("buscnt",busCnt)
    print(V[currIterations][busCnt])
    for q in range(n):
      if q!=busCnt:
          V[currIterations][busCnt]-=(B[busCnt][q]*V[currIterations-1][q])
      print(V[currIterations][busCnt])
    busCnt+=1
  currIterations+=1
    


# Printing the Y-matrix (admittance matrix) for verification
print("\n Admittance matrix Y:")
for row in Y:
  print(row)
# Printing the voltages at end of iterations matrix) for verification
print("\n voltage V:")  
for row in V:
  print(row)

    
  