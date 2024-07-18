#ARR-average/accounting/unadjusted rate of return
# or financial statement method
annual_profits=[]
print("Enter initial investment")
init_investment=int(input())
print("Enter number of years")
years=int(input())
print("Enter annual profits")
for i in range(years):
    annual_profits.append(int(input()))
print("Enter Scrap value")
scrap_value=int(input())
print("Enter working capital")
working_capital=int(input())
avg_annual_prof=sum(annual_profits)/years
net_avg_investment=(init_investment-scrap_value)/2 +working_capital+scrap_value
arr=avg_annual_prof/net_avg_investment
print("Average rate of return is ",arr*100,"%")
