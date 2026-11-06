import pandas as pd, numpy as np, json
from scipy import stats
d=pd.read_csv('top10_cancer_incidence_2014_2023.csv')
FY=list(range(2024,2031)); PHI=0.8
def ols(years,y,dummy):
    t=np.array(years)-2014.0
    cols=[np.ones(len(t)),t]+([(np.array(years)==2020).astype(float)] if dummy else [])
    X=np.column_stack(cols); ly=np.log(y)
    b=np.linalg.lstsq(X,ly,rcond=None)[0]; r=ly-X@b; dof=len(ly)-X.shape[1]
    return dict(b=b,s2=r@r/dof,XtXi=np.linalg.inv(X.T@X),dof=dof,k=X.shape[1])
def ll_pred(m,years):
    t=np.array(years)-2014.0
    X=np.column_stack([np.ones(len(t)),t]+([np.zeros(len(t))] if m['k']==3 else []))
    mu=X@m['b']; se=np.sqrt(m['s2']*(1+np.einsum('ij,jk,ik->i',X,m['XtXi'],X)))
    return mu,se
def damp_pred(last_year,last_val,slope,years):
    h=np.array(years)-last_year
    return np.log(last_val)+slope*np.array([sum(PHI**k for k in range(1,int(x)+1)) for x in h])
def mape(p,a): return float(np.mean(np.abs(p-a)/a)*100)
R=lambda a:[round(float(x),2) for x in a]
sites=[]; bt={'inc':{m:[] for m in ['trend','damped','naive','ensemble']},'death':{m:[] for m in ['trend','damped','naive','ensemble']}}
for site,g in d.groupby('cancer_site'):
    g=g.sort_values('year'); yrs=g.year.tolist()
    r=dict(site=site,rank=int(g.rank_2026_est_cases.iloc[0]),pop=g.population.iloc[0],
       cases2026=int(g.est_new_cases_2026.iloc[0]),deaths2026=int(g.est_deaths_2026.iloc[0]),
       aapcInc=float(g.aapc_incidence_2014_2023.iloc[0]),aapcDeath=float(g.aapc_death_2015_2024.iloc[0]),
       surv=float(g.five_yr_rel_survival_pct_2016_2022.iloc[0]),source=g.source.iloc[0],years=yrs)
    for key,col,dm in [('inc','incidence_rate_per100k',True),('death','death_rate_per100k',False)]:
        y=g[col].values; r[key]=R(y)
        m=ols(yrs,y,dm); mu,se=ll_pred(m,FY); dmu=damp_pred(2023,y[-1],m['b'][1],FY)
        ens=(mu+dmu)/2; q=stats.t.ppf(.975,m['dof'])
        r[key+'Trend']=R(np.exp(mu)); r[key+'Damped']=R(np.exp(dmu)); r[key+'Fc']=R(np.exp(ens))
        r[key+'Lo']=R(np.exp(ens-q*se)); r[key+'Hi']=R(np.exp(ens+q*se))
        r[key+'Apc']=round((np.exp(m['b'][1])-1)*100,2)
        fmu,_=ll_pred(m,yrs); r[key+'Fit']=R(np.exp(fmu))
        if dm:
            r['covidGap']=round((np.exp(m['b'][2])-1)*100,1)
            r['covidExpected']=round(float(np.exp(fmu[yrs.index(2020)])),2)
        # backtest: train 2014-2019, test 2021-2023
        tr=g[g.year<=2019]; te=g[g.year>=2021]; tp=te.year.tolist(); a=te[col].values
        mb=ols(tr.year.tolist(),tr[col].values,False); bmu,_=ll_pred(mb,tp)
        bd=damp_pred(2019,tr[col].values[-1],mb['b'][1],tp)
        P={'trend':np.exp(bmu),'damped':np.exp(bd),'naive':np.repeat(tr[col].values[-1],len(tp)),'ensemble':np.exp((bmu+bd)/2)}
        r[key+'Backtest']={k:round(mape(v,a),2) for k,v in P.items()}
        r[key+'BacktestPred']=R(P['ensemble'])
        for k,v in P.items(): bt[key][k].append(mape(v,a))
    r['mir']=round(r['death'][-1]/r['inc'][-1],3)
    sites.append(r)
sites.sort(key=lambda r:r['rank'])
summary={k:{m:round(float(np.mean(v)),2) for m,v in bt[k].items()} for k in bt}
print(summary)
for r in sites: print(f"{r['site']:22s} inc23 {r['inc'][-1]:7.2f} inc30 {r['incFc'][-1]:7.2f} [{r['incLo'][-1]:.1f},{r['incHi'][-1]:.1f}] d23 {r['death'][-1]:6.2f} d30 {r['deathFc'][-1]:6.2f} gap {r['covidGap']} bt {r['incBacktest']['ensemble']}/{r['deathBacktest']['ensemble']}")
json.dump({'forecastYears':FY,'phi':PHI,'backtestSummary':summary,'sites':sites},open('data.json','w'),separators=(',',':'))
