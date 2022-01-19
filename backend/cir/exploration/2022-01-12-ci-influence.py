import seaborn as sns
import numpy as np
import scipy as sp
import pandas as pa
from pathlib import Path
from cir.interface import csv
from cir.util.data import DataSet

dataset = DataSet(
        ci_path=Path("data/cotations/2022-11-26b_Cotations CI - Coefficients aggrégés - Sans Thématique-Identité.csv"),
        metiers_path=Path("data/métiers/Métiers CI correctifs du 23_11_21.csv")
)

metiers = csv.get_metiers(dataset)

mc = metiers.coefficients

qs = [0.5,0.75, 0.95, 0.99]
quantiles = np.array([np.quantile(ci, q=qs) for ci in mc.transpose()])

df = pa.DataFrame(mc.transpose())
df.index.name = "ci"
df.columns.name = "metier"

lg = df.reset_index().melt(id_vars=["ci"], var_name="metier", value_name="coef")

influence_sum = lg.groupby("ci").sum() \
    .assign(rank=lambda x:np.asarray(x.rank(method="first"), dtype=np.int32))
influence_var = lg.groupby("ci").var() \
    .assign(rank=lambda x:np.asarray(x.rank(method="first"), dtype=np.int32))

lgi = lg.assign(
        influence_sum=influence_sum.loc[:,"coef"].loc[lg.ci.values].values,
        influence_sum_rank=influence_sum.loc[:, "rank"].loc[lg.ci.values].values,
        influence_var=influence_var.loc[:,"coef"].loc[lg.ci.values].values,
        influence_var_rank=influence_var.loc[:, "rank"].loc[lg.ci.values].values,
)
