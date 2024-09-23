function checkIfInSquare(x, y, r){
    result = false;

    //in  square
    result = result || (0 <= x <= r && 0 <= y <= r);
    // in circle
    result = result || (-r/2 <= x <= 0 && 0 <= y <= r/2 && x**2 + y**2 <= r**2/4);
    // in triang
    result = result || (y >= 2*R-2);

    return result;
}
