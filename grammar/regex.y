// A syntax tree for a regular expression is an array of arrays. Each
// subarray in the main array is a alternation path. The items the subarray
// are javascript objects representing a discrete part of the regular
// expression.
%%
topLevel
  : regex tEND
    { return $1; }
  | tEND
    { return [[]]; }
  ;

regex
  : expr
    { $$ = [[$1]]; }
  | regex expr
    {
      $1[$1.length-1].push($2);
      $$ = $1;
    }
  | regex '|' regex
    { $$ = $1.concat($3); }
  ;

expr
  : literal
    {
      $$ = {
        type: 'LITERAL',
        value: $1
      };
    }
  | subexpr
  ;

literal
  : tCHAR
  | literal tCHAR
    { $$ = $1 + $2; }
  ;

subexpr
  : chunk
    {
      $1.repetition = {
        range: [1,1],
        type: 'greedy'
      };
      $$ = $1;
    }
  | chunk repetition
    {
      $1.repetition = $2;
      $$ = $1;
    }
  ;

repetition
  : repetitionHead
    {
      $$ = {
        range: $1,
        type: 'greedy'
      };
    }
  | repetitionHead '?'
    {
      $$ = {
        range: $1,
        type: 'lazy'
      };
    }
  | repetitionHead '+'
    {
      $$ = {
        range: $1,
        type: 'possessive'
      };
    }
  ;

repetitionHead
  : '?'
    { $$ = [0,1]; }
  | '+'
    { $$ = [1,9007199254740990]; }
  | '*'
    { $$ = [0,9007199254740990]; }
  | '{' repetitionRepr '}'
    { $$ = $2; }
  ;

repetitionRepr
  : ','
    { $$ = [0,9007199254740990]; }
  | tNUM ','
    { $$ = [parseInt($1),9007199254740990]; }
  | ',' tNUM
    { $$ = [0,parseInt($2)]; }
  | tNUM ',' tNUM
    { $$ = [parseInt($1),parseInt($3)]; }
  ;

chunk
  : group
  | tCHAR
    {
      $$ = {
        type: 'SINGLECHAR',
        value: $1
      };
    }
  | tBACKREF
    {
      $$ = {
        type: 'BACKREF',
        value: parseInt($1.slice(1))
      };
    }
  ;

group
  : '(' groupGuts ')'
    { $$ = $2 }
  ;

groupGuts
  : regex
    {
      $$ = {
        type: 'GROUP',
        grouptype: 'CAPTURE',
        value: $1
      };
    }
  | specialGroup
  | subroutine
  ;

specialGroup
  : noCapture
  | atomic
  ;

noCapture
  : tNOCAPTURE regex
    {
      $$ = {
        type: 'GROUP',
        grouptype: 'NOCAPTURE',
        value: $2
      };
    }
  ;

atomic
  : tATOMIC regex
    {
      $$ = {
        type: 'GROUP',
        grouptype: 'ATOMIC',
        value: $2
      };
    }
  ;

subroutine
  : '?' tNUM
    {
      $$ = {
        type: 'SUBROUTINE',
        value: parseInt($2)
      };
    }
  ;