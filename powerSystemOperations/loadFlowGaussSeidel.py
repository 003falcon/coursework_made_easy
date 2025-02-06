# def get_complex_input(is_admittance):
#   while True:
#     try:
#       values = input("Enter complex values separated by space (real and imaginary parts): ").split()
#       if values[0].lower() == 'q':
#           return 'q'
#       real, imag =float(values[0]), float(values[1])
#       return complex(real, imag)
#     except (ValueError, IndexError):
#       print("Invalid input. Please enter the complex values in the format 'real imaginary'.")

#Main code
iteration=1
busCnt=1
n=int(input("Enter number of buses"))

Y=[[ 0 for _ in range(n)] for _ in range(n)]

isAdmittance=(input("Enter yes for entering admittance or no for impedance of lines").lower()=="yes")

print("Start entering admittances/impedances .To stop ,enter q.")
while(True):
  print("Enter source bus and destination bus of line admittance or 'q' to quit")
  val=input("").split()
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
    y=[float(val) for val in input("Enter admittance in complex form").split()]
    Y[frm][to]=complex(y[0],y[1])
  else:
    z=[float(val) for val in input("Enter impedance in complex form").split()]
    yFromZ=[round(z[0]/(z[0]**2 + z[1]**2),5),round(-z[1]/(z[0]**2 + z[1]**2),5)]
    Y[frm][to]=complex(yFromZ[0],yFromZ[1])
  Y[to][frm]=Y[frm][to]

#     if is_admittance:
#         y = get_complex_input(is_admittance)
#         if y == 'q':
#             break
#         Y[frm][to] = round(y, 5)
#     else:
#         z = get_complex_input(is_admittance)
#         if z == 'q':
#             break
#         Y[frm][to] = round(1 / z, 5)
#     Y[to][frm] = Y[frm][to]

# Printing the Y-matrix (admittance matrix) for verification
print("\nAdmittance matrix Y:")
for row in Y:
  print(row)

    
  