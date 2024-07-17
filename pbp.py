#pbp payback period
print("Enter initial investment")
init_investment=int(input())
print("Enter YES if inflow is uniform otherwise NO")
uniform_inflow=input()
if(uniform_inflow=="YES"):
    print("ENTER ANNUAL Cash Inflow")
    annual_cash_inflow=int(input())
    print("Payback period is",init_investment/annual_cash_inflow,"years")
else:
    print("Total years")
    tot_years=int(input())
    nonuniform_revenues=[]
    print("Enter the non uniform annual revenues")
    for i in range(tot_years):
        nonuniform_revenues.append(int(input()))
    cumul_revenue=[]
    cumul_revenue.append(nonuniform_revenues[0])
    for i in range(1,tot_years):
        cumul_revenue.append(cumul_revenue[i-1]+nonuniform_revenues[i])
    print("Enter recovery period")
    recovery_period=int(input())
    # fund_deficit=int(input())
    # subsequent_year_revenue=int(input())
    pbp=recovery_period+(init_investment-cumul_revenue[recovery_period-1])/nonuniform_revenues[recovery_period]
    print("pbp for non uniform annual returns is",pbp)

