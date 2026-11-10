(function(){
 const packages=[3000,7500,15000,25000], mix=[.675,.25,.05,.025], price=packages.reduce((s,p,i)=>s+p*mix[i],0);
 const fixed=57500, variableRate=.12, setup=180000, lag=1;
 const plans={
   base:[[0,1,2,3,4,5,6,7,8,9,11,12],[13,14,15,16,17,18,19,20,21,22,23,24],[25,26,27,28,29,30,31,32,33,34,35,36],[37,38,39,40,41,42,43,44,45,46,47,48],[49,50,51,52,53,54,55,56,57,58,59,60]],
   downside:[[0,0,1,1,2,3,3,4,4,5,6,6],[7,7,8,8,9,9,10,10,11,11,12,12],[13,13,14,14,15,15,16,16,17,17,18,18],[19,19,20,20,21,21,22,22,23,23,24,24],[25,25,26,26,27,27,28,28,29,29,30,30]]
 };
 function calc(plan){
  let cumulative=-setup;
  const accounts=plan.flat();
  const monthly=accounts.map((n,i)=>{
   const revenue=n*price, cost=fixed+revenue*variableRate, collected=(accounts[i-lag]||0)*price;
   const operating=revenue-cost,cash=collected-cost;
   cumulative+=cash;
   return {month:i+1,accounts:n,revenue,cost,collected,operating,cash,cumulative};
  });
  return {monthly,annual:plan.map((_,i)=>monthly.slice(i*12,i*12+12).reduce((a,m)=>({revenue:a.revenue+m.revenue,cost:a.cost+m.cost,operating:a.operating+m.operating}),{revenue:0,cost:0,operating:0})),breakEven:monthly.find(m=>m.operating>=0)?.month||null,payback:monthly.find(m=>m.cumulative>=0)?.month||null,peakNeed:-Math.min(-setup,...monthly.map(m=>m.cumulative))};
 }
 const model={packages,mix,price,fixed,variableRate,setup,lag,threshold:fixed/(1-variableRate),accountsThreshold:Math.ceil(fixed/(price*(1-variableRate))),base:calc(plans.base),downside:calc(plans.downside)};
 if(typeof module!=='undefined')module.exports=model;else window.PitchFinance=model;
})();
