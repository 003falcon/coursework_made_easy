import sys


# filename = "input.txt"
# print("Current Working Directory:", os.getcwd())
# if os.path.exists(filename):
#     sys.stdin = open(filename, "r")
# else:
#     print(f"Error: {filename} not found. Please check the file location.")
#     exit(1)
# Redirect standard input to read from file
sys.stdin = open('./powerSystemOperations/input.txt', 'r')

# # def get_complex_input(is_admittance):
# #   while True:
# #     try:
# #       values = input("Enter complex values separated by space (real and imaginary parts): ").split()
# #       if values[0].lower() == 'q':
# #           return 'q'
# #       real, imag =float(values[0]), float(values[1])
# #       return complex(real, imag)
# #     except (ValueError, IndexError):
# #       print("Invalid input. Please enter the complex values in the format 'real imaginary'.")

#Main code
iterations=3
# print("Enter number of buses")
n=int(input())

#Building Y Bus

def buildYbus(n):
  Y=[[ 0 for _ in range(n)] for _ in range(n)]
  # print("Enter yes for entering admittance or no for impedance of lines")
  isAdmittance=(input().lower()=="yes")

  # print("Start entering admittances/impedances .To stop ,enter q.")
  while(True):
    # print("Enter source bus and destination bus of line admittance or 'q' to quit")
    val=input().split()
    if(val[0].lower()=='q'):
      break
    try:
      [frm,to]=[int(x) for x in val]
      frm-=1
      to-=1
    except ValueError:
      print("Invalid input. Please enter the source and destination bus numbers.")
      continue
        
    if isAdmittance:
      # print("Enter admittance in complex form")
      y=[float(val) for val in input().split()]
      Y[frm][to]=-1*complex(y[0],y[1])
    else:
      # print("Enter impedance in complex form")
      z=[float(val) for val in input().split()]
      yFromZ=[round(z[0]/(z[0]**2 + z[1]**2),5),round(-z[1]/(z[0]**2 + z[1]**2),5)]
      Y[frm][to]=-1*complex(yFromZ[0],yFromZ[1])
    Y[to][frm]=Y[frm][to]
    
  for i in range(n):
    Y[i][i]=-1*sum(Y[i])
  return Y
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
  # V[1]=cmath.rect(1,math.radians(60))
  
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

# A=[complex(0,0) for _ in range(n)]
# B=[[complex(0,0) for _ in range(n)] for _ in range(n)]
A = [(-1j * Q[i] + P[i]) / Y[i][i] for i in range(n)]
B = [[complex(0, 0) if i == j else Y[i][j] / Y[i][i] for j in range(n)] for i in range(n)]

# for i in range(n):
#   A[i]=complex(0,-1)*Q[i]
#   A[i]+=P[i]
#   A[i]/=Y[i][i]
  
# for i in range(1,n):
#   for j in range(n):
#     if j==i:
#       continue
#     B[i][j]=Y[i][j]/Y[i][i]

print(" A  matrix")
for row in A:
  print(row)  

accFac=1.6
currIteration=1
while currIteration<=iterations:
  busCnt=1
  while busCnt<n:
    
    V[currIteration][busCnt]=A[busCnt]/(V[currIteration-1][busCnt].conjugate())
    print("buscnt",busCnt)
    print(V[currIteration][busCnt])
    for q in range(n):
      if q!=busCnt:
        if q<=busCnt:
          V[currIteration][busCnt]-=(B[busCnt][q]*V[currIteration][q])
        else:
          V[currIteration][busCnt]-=(B[busCnt][q]*V[currIteration-1][q])
      print(V[currIteration][busCnt])
    V[currIteration][busCnt]=V[currIteration-1][busCnt] + accFac*(V[currIteration][busCnt]-V[currIteration-1][busCnt])
    busCnt+=1
  currIteration+=1
    


# Printing the Y-matrix (admittance matrix) for verification
print("\n Admittance matrix Y:")
for row in Y:
  print(row)
# Printing the voltages at end of iterations matrix) for verification
print("\n voltage V:")  
for row in V:
  print(row)

    
  