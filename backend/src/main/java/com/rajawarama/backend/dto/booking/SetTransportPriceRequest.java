package com.rajawarama.backend.dto.booking;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SetTransportPriceRequest {

    @NotNull(message = "Transport price is required!")
    @PositiveOrZero(message = "Transport price cannot be negative!")
    private Double transportPrice;
}
 