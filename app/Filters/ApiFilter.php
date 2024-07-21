<?php

namespace App\Filters;

use Illuminate\Http\Request;


class ApiFilter {
    protected $safeParams = [];

    protected $operatorMap = [];
    public function transform(Request $request){
        $eloQuery = [];
    
        foreach($this->safeParams as $parm => $operators){
            $query = $request->query($parm);

            // Dump request and query for debugging
            
                
            if (!isset($query)){
                continue;
            }
    
            $column = $parm;

    
        
            foreach($operators as $operator){
                if(isset($query[$operator])){
                    // Handle array structure for 'gt' operator
                    $value = ($operator === 'gt' && is_array($query[$operator])) ? $query[$operator][0] : $query[$operator];
                    
                    $eloQuery[] = [$column, $this->operatorMap[$operator], $value];
                }
            }
        }
        return $eloQuery;
    }
    
}