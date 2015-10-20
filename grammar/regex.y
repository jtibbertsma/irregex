%%
topLevel
  : tCHAR tEND
    { return [$1]; }
  | tEND
    { return []; }
  ;