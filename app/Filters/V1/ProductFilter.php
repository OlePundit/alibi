<?php

namespace App\Filters\V1;

use Illuminate\Http\Request;
use App\Filters\ApiFilter;


class ProductFilter extends ApiFilter{
    protected $safeParams = [
        'name'=>['eq','startsWith' ],
        'description'=>['eq'],
        'volume'=>['eq'],
        'image'=>['eq'],
        'price'=>['eq','gt','lt'],
        'stock'=>['eq'],
        'category'=>['eq'],
        
    ];

    protected $operatorMap = [
        'eq'=>'=',
        'lt'=>'<',
        'gte'=>'≥',
        'lte'=>'≤',
        'gt'=>'>',
        'startsWith' => 'LIKE',


    ];
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