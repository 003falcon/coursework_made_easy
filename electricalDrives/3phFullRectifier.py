import sys
import math
# Redirect standard input to read from file
sys.stdin = open('./electricalDrives/inputs.txt', 'r')
#output voltage
Va=int(input())
#rated speed
Wm=int(input())
Ia=int(input())
Ra=float(input())
isLineVoltage=input()=="yes"
Vl=0
if isLineVoltage :
  Vl=int(input())
else:
  Vl=int(input())*(3**0.5)

Vm=math.pi*Va/3
Eb=Va-Ia*Ra

W=int(input())
E=Eb * W/Wm
multiplierTrq=float(input())
V=E+multiplierTrq*Ia*Ra

val=math.pi*V/(Vm*3)
alpha=math.acos(val)
print(alpha,"in radians")
print(alpha*180/math.pi,"in radians")
