(function(){
 // list prices and package mix
 const packages=[3000,7500,15000,25000], mix=[.675,.25,.05,.025], price=packages.reduce((s,p,i)=>s+p*mix[i],0);
 // price stage by year: Year 1 founding-partner rates (50% of list), Year 2 introductory rates (80%), Year 3+ full list
 const priceStage=[.5,.8,1,1,1], founderPackages=packages.map(p=>p*priceStage[0]), yearPrice=priceStage.map(f=>price*f);
 const field=[144000,288000,480000,720000,960000];
 // revenue-linked costs: 12% delivery/hosting + 5% sales commission + 3% tax & payment fees
 const deliveryRate=.12, commissionRate=.05, taxFeeRate=.03;
 const variableRate=Math.round((deliveryRate+commissionRate+taxFeeRate)*100)/100, setup=180000, lag=1;
 const basePlan=[[2,4,7,10,13,16,19,22,25,28,31,34],[36,38,40,42,44,46,48,50,52,54,56,58],[44,51,58,65,72,79,86,93,100,107,115,123],[133,145,157,169,181,193,205,217,229,241,253,265],[281,303,325,347,369,391,413,435,457,479,501,523]];
 const slowerPlan=[[1,2,4,6,8,10,12,14,16,18,20,22],...basePlan.slice(1).map(year=>year.map(n=>Math.floor(n*.65)))];
 const team=[600000,900000,2100000,4800000,8700000];
 const technology=[90000,180000,480000,1020000,1800000];
 const scaleCities=[1,4,10,22,40];
 const fixedByYear=team.map((v,i)=>(v+technology[i]+field[i])/12);
 // hiring and city launches are staged through each year: monthly fixed cost rises linearly from the prior year's run-rate, annual totals unchanged
 const fixedMonthly=(()=>{const out=[];let prev=fixedByYear[0];fixedByYear.forEach((m,y)=>{const total=m*12,start=y?prev:m,end=y?start+(total-12*start)*12/78:m;for(let k=0;k<12;k++)out.push(y?start+(end-start)*(k+1)/12:m);prev=y?end:m;});return out;})();
 function calc(plan,fixedYear,collectionMonths=lag){
  let cumulative=-setup;
  const accounts=plan.flat();
  const monthly=accounts.map((n,i)=>{
   const y=Math.floor(i/12),revenue=n*yearPrice[y], cost=(fixedYear.length>12?fixedYear[i]:fixedYear[y])+revenue*variableRate, j=i-collectionMonths, collected=j>=0?accounts[j]*yearPrice[Math.floor(j/12)]:0;
   const operating=revenue-cost,cash=collected-cost;
   cumulative+=cash;
   return {month:i+1,accounts:n,price:yearPrice[y],revenue,cost,collected,operating,cash,cumulative};
  });
  const firstProfitable=monthly.find(m=>m.operating>=0)?.month??null;
  const sustained=(key)=>{const lastLoss=monthly.findLastIndex(m=>m[key]<0);return lastLoss===monthly.length-1?null:lastLoss+2;};
  return {monthly,annual:plan.map((_,i)=>monthly.slice(i*12,i*12+12).reduce((a,m)=>({revenue:a.revenue+m.revenue,cost:a.cost+m.cost,operating:a.operating+m.operating}),{revenue:0,cost:0,operating:0})),firstProfitable,breakEven:sustained('operating'),payback:sustained('cumulative'),peakNeed:-Math.min(-setup,...monthly.map(m=>m.cumulative))};
 }
 const funding=[90000,90000,720000];
 const fixed=fixedByYear[0];
 const model={funding,packages,founderPackages,priceStage,yearPrice,mix,price,fixed,fixedByYear,variableRate,deliveryRate,commissionRate,taxFeeRate,setup,lag,
  threshold:fixed/(1-variableRate),accountsThreshold:Math.ceil(fixed/(yearPrice[0]*(1-variableRate))),listThreshold:Math.ceil(fixed/(price*(1-variableRate))),
  team,technology,field,scaleCities,base:calc(basePlan,fixedMonthly),fixedMonthly,downside:calc(slowerPlan,[57500,82000,193000,410000,725000].map((v,i)=>v+field[i]*.5/12),2)};
 if(typeof module!=='undefined')module.exports=model;else window.PitchFinance=model;
})();
