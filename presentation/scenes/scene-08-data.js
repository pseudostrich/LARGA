(function(){
 'use strict';
 const model=window.PitchFinance,annual=model.base.annual;
 const mix=[27,10,2,1];
 const allocation=model.funding;
 const revenue=annual.map(y=>y.revenue);
 const opex=model.team.map((v,i)=>v+model.field[i]);
 const fixed=model.technology;
 const service=annual.map((y,i)=>y.cost-opex[i]);
 const gross=revenue.map((value,i)=>value-service[i]);
 const operating=annual.map(y=>y.operating);
 const advertisers=annual.map((_,i)=>model.base.monthly.slice(i*12,i*12+12).reduce((sum,m)=>sum+m.accounts,0)/12);
 window.LargaFinance={
  cities:model.scaleCities,prices:model.packages,mix,advertisers,revenue,opex,fixed,service,gross,operating,
  variableRate:model.variableRate,founderPrices:model.founderPackages,priceStage:model.priceStage,yearPrice:model.yearPrice,listThreshold:model.listThreshold,deliveryRate:model.deliveryRate,commissionRate:model.commissionRate,taxFeeRate:model.taxFeeRate,technology:model.technology,field:model.field,funding:allocation,firstProfitable:model.base.firstProfitable,breakEven:model.base.breakEven,
  payback:model.base.payback,peakMonth:model.base.monthly.reduce((a,b)=>b.cumulative<a.cumulative?b:a).month,peakNeed:model.base.peakNeed,thresholdAccounts:model.accountsThreshold,
  downside:model.downside,collectionLag:model.lag,
  revenueGrowth:revenue.map((value,i)=>i?value/revenue[i-1]-1:null),
  opexBreakdown:{"founderAllowances":[180000],"researchFunds":[120000],"outreach":[144000],"adminToolsDepreciation":[96000],"contingency":[60000],"driverData":[model.field[0]]},
  businessContext:{"year":2025,"permitApplications":50961,"january2026Applications":45621,"source":"https://davaocity.gov.ph/business-and-industry-support-development/biz-permit-applications-increase/","scope":"Applications and renewals, not unique firms or eligible advertiser counts."}
 };
})();
